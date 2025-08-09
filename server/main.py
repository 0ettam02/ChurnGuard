from fastapi import FastAPI, Query
from pydantic import BaseModel
import numpy as np
import joblib
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi import UploadFile, File
import shutil
import os

BASE_DIR = os.path.dirname(__file__)

model_churn = joblib.load(os.path.join(BASE_DIR, "modello_churn.pkl"))
model_mese_abbandono = joblib.load(os.path.join(BASE_DIR, "modello_ultima_presenza.pkl"))

df_encoded = None
df_noChurn = None

@app.post("/modello_dataset")
async def upload_dataset(file: UploadFile = File(...)):
    global df_encoded, df_noChurn

    try:
        upload_dir = "uploaded_datasets"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        df_encoded, df_noChurn = datasets(file_path)

        return {
            "message": "Dataset caricato e processato correttamente.",
            "record_totali": len(df_encoded),
            "record_noChurn": len(df_noChurn)
        }

    except Exception as e:
        return {"error": f"Errore durante il caricamento: {str(e)}"}


def datasets(path):
    df = pd.read_csv(path)

    df['data_iscrizione'] = pd.to_datetime(df['data_iscrizione'])
    df['anno_iscrizione'] = df['data_iscrizione'].dt.year
    df['mese_iscrizione'] = df['data_iscrizione'].dt.month
    df.drop('data_iscrizione', axis=1, inplace=True)

    df['ultima_presenza'] = pd.to_datetime(df['ultima_presenza'])
    df['mese_ultima_presenza'] = df['ultima_presenza'].dt.month
    df.drop('ultima_presenza', axis=1, inplace=True)

    le = LabelEncoder()
    df['tipo_abbonamento_encoder'] = le.fit_transform(df['tipo_abbonamento'])
    df.drop('tipo_abbonamento', axis=1, inplace=True)

    df_encoded = pd.get_dummies(df, columns=['sesso'])
    df_noChurn = df_encoded[df_encoded["churn"] == 0]

    return df_encoded, df_noChurn

# SEZIONE VERIFICA CHURN----------------------------------------------------------------------------------
class InputUtente(BaseModel):
    eta: float
    prezzo_abbonamento: float
    media_presenze_sett: float
    giorni_da_ultima_presenza: float
    anno_iscrizione: int
    mese_iscrizione: int
    tipo_abbonamento_encoder: int
    sesso_F: int
    sesso_M: int

@app.post("/predict")
def predizione_dati(dati: InputUtente):
    dati_presenza = np.array([[
        dati.eta,
        dati.prezzo_abbonamento,
        dati.media_presenze_sett,
        dati.giorni_da_ultima_presenza,
        dati.anno_iscrizione,
        dati.mese_iscrizione,
        dati.tipo_abbonamento_encoder,
        dati.sesso_F,
        dati.sesso_M
    ]])
    
    mese_predetto = model_mese_abbandono.predict(dati_presenza)[0]

    input_churn = np.insert(dati_presenza[0], 6, mese_predetto).reshape(1, -1)

    pred = model_churn.predict(input_churn)
    return {
        "churn_predetto": int(pred[0]),
        "mese_abbandono_predetto": int(mese_predetto)
    }

@app.get("/churn_info")
def churn_info():
    global df_encoded
    totale_churn1 = len(df_encoded[df_encoded["churn"] == 1])
    media_churn = (df_encoded["churn"] == 1).mean()
    return {
        "totale_churn": totale_churn1,
        "percentuale_churn": round(media_churn * 100, 2)
    }


dati = "età, prezzo_abbonamento, media_presenze_sett, giorni_da_ultima_presenza, anno_iscrizione, mese_iscrizione, mese_utlima_presenza, tipo_abbonamento_encoder, sesso_F, sesso_M"
lista = dati.split(",")

class InputDati(BaseModel):
    valori: list[float]

@app.post("/churn_info_mensili")
def churn_info_mensili(input_data: InputDati):
    global df_encoded
    valori_presenza = np.array(input_data.valori)
    valori_presenza_2d = valori_presenza.reshape(1, -1)

    pred_presenza = model_mese_abbandono.predict(valori_presenza_2d)[0]

    valori_completi = np.insert(valori_presenza, 6, pred_presenza)
    valori_2d = valori_completi.reshape(1, -1)

    churn_pred = model_churn.predict(valori_2d)[0]

    filtro = (df_encoded["churn"] == 1) & (df_encoded["età"] >= valori_completi[0])
    df_presenze = df_encoded.loc[filtro, ["giorni_da_ultima_presenza", "età"]]
    media = df_presenze["giorni_da_ultima_presenza"].mean()

    mesi = next((i for i in range(1, 12) if media <= 30 * i), ">12")

    importanze = model_churn.feature_importances_
    importanza_dict = {
        lista[i]: round(importanze[i] * 100, 2) for i in range(len(lista))
    }

    return {
    "churn_pred": int(churn_pred),
    "giorni_da_ultima_presenza_previsti": round(float(pred_presenza), 1),
    "eta": int(valori_completi[0]),
    "media_giorni_churn_simili": round(float(media), 1),
    "abbandono_mediamente_dopo_mesi": mesi,
    "importanza_caratteristiche": importanza_dict,
    "messaggio": (
        f"In media le persone con età maggiore di {int(valori_completi[0])} anni "
        f"abbandonano la palestra dopo {mesi} mese/i"
    )
    }


@app.get("/churn_presenzaSett")
def churn_presenzaSett():
    global df_encoded
    media_presenzeSett_churn = df_encoded[df_encoded["churn"] == 1]["media_presenze_sett"].mean()
    media_presenzeSett_non_churn = df_encoded[df_encoded["churn"] == 0]["media_presenze_sett"].mean()

    soglia = 1.5
    return {
        "messaggio_presenze": (
            f"In media, chi ha abbandonato si allenava {media_presenzeSett_churn:.2f} volte a settimana. Praticamente meno di 1 volta a settimana"
            if media_presenzeSett_churn < 1 else
            f"In media, chi ha abbandonato si allenava {media_presenzeSett_churn:.2f} volte a settimana."
            if media_presenzeSett_churn < soglia else
            f"In media, chi ha mantenuto l'abbonamento si allenava {media_presenzeSett_non_churn:.2f} volte a settimana."
        )
    }


@app.get("/istogramma_distribuzione_frequenza_abbandoni")
def istogramma_distribuzione_frequenza_abbandoni():
    global df_encoded
    from fastapi.responses import JSONResponse

    x = df_encoded[df_encoded["churn"] == 1]["età"]

    bins = range(int(x.min()), int(x.max()) + 10, 10)
    hist = pd.cut(x, bins=bins).value_counts().sort_index()

    result = [
        {"eta": f"{interval.left}-{interval.right}", "frequenza": int(count)}
        for interval, count in hist.items()
    ]

    return JSONResponse(content=result)

@app.get("/grafico_abbandoni_per_abbonamento")
def grafico_abbandoni_per_abbonamento():
    global df_encoded
    from fastapi.responses import JSONResponse
    import matplotlib.pyplot as plt

    churn_counts = df_encoded[df_encoded["churn"] == 1]["tipo_abbonamento_encoder"].value_counts().sort_index()

    labels = ["Annuale", "Mensile", "Trimestrale"]

    result = [
        {"tipo_abbonamento": labels[i], "numero_abbandoni": int(churn_counts[i])}
        for i in range(len(labels))
    ]

    return JSONResponse(content=result)

@app.post("/info_soldi")
def info_soldi(input_data: InputDati):
    global df_encoded

    soldi = input_data.valori[1]
    mese_finale = input_data.valori[6]
    if mese_finale < 12:
        mesi_mancanti = 12 - mese_finale
        soldi_persi = soldi * mesi_mancanti

    filtro_soldi = (df_encoded["churn"]==1) & (df_encoded["tipo_abbonamento_encoder"]==1) & (df_encoded["mese_ultima_presenza"] <= 6)
    perdita_totale = df_encoded.loc[filtro_soldi, "prezzo_abbonamento"].sum()
    return {
        "messaggio": (
            f"i soldi potenzialmente persi per l'abbandono di questo cliente, ammonterebbero a {soldi_persi:.2f} euro, e la perdita totale dei clienti simili al cliente attuale, ammonta a {perdita_totale} euro"
        )
    }

# SEZIONE ALERT---------------------------------------------------------------------------------------
@app.get("/utenti_rischio")
def utenti_rischio():
    global df_noChurn
    import numpy as np
    import joblib
    from fastapi import HTTPException

    if df_noChurn is None:
        raise HTTPException(status_code=500, detail="Dataset non caricato. Usa prima /modello_dataset")

    filtro_giorni = df_noChurn[df_noChurn["media_presenze_sett"] < 0.5]["customer_id"]
    lista_filtro_giorni = filtro_giorni.values.tolist()
    tutti_valori_utenti = []
    dati = "età,prezzo_abbonamento,media_presenze_sett,giorni_da_ultima_presenza,anno_iscrizione,mese_iscrizione,mese_ultima_presenza,tipo_abbonamento_encoder,sesso_F,sesso_M"
    lista = dati.split(",")


    for i in range(len(lista_filtro_giorni)):
        valori_utenti = df_noChurn[df_noChurn["customer_id"]==lista_filtro_giorni[i]][lista].values.tolist()
        #qui metto 0, perchè ad ogni iterazione sovrascrivo quello di prima, quindi salvo nella lista l'unico valore valori_utenti, poi sovrascrivo e cosi via riempiendo la lista
        tutti_valori_utenti.append(valori_utenti[0])


    modello = model_churn

    np_valori_utenti = np.array(tutti_valori_utenti)

    pred = modello.predict(np_valori_utenti)

    notifiche_sett = []
    for i, prediction in enumerate(pred):
        if prediction == 1:
            customer_id = lista_filtro_giorni[i]
            notifiche_sett.append({
                "id": i + 1,
                "customer_id": customer_id,
                "message": f"Il cliente {customer_id} è a rischio abbandono, SCOPRI IL PERCHÈ"
            })
# ----------------------------------------------
    filtro_giorni = df_noChurn[df_noChurn["giorni_da_ultima_presenza"] > 20]["customer_id"]
    lista_filtro_giorni = filtro_giorni.values.tolist()
    tutti_valori_utenti = []
    dati = "età,prezzo_abbonamento,media_presenze_sett,giorni_da_ultima_presenza,anno_iscrizione,mese_iscrizione,mese_ultima_presenza,tipo_abbonamento_encoder,sesso_F,sesso_M"
    lista = dati.split(",")


    for i in range(len(lista_filtro_giorni)):
        valori_utenti = df_noChurn[df_noChurn["customer_id"]==lista_filtro_giorni[i]][lista].values.tolist()
        #qui metto 0, perchè ad ogni iterazione sovrascrivo quello di prima, quindi salvo nella lista l'unico valore valori_utenti, poi sovrascrivo e cosi via riempiendo la lista
        tutti_valori_utenti.append(valori_utenti[0])


    modello = model_churn

    np_valori_utenti = np.array(tutti_valori_utenti)

    pred = modello.predict(np_valori_utenti)
    notifiche_giorni = []
    for i, prediction in enumerate(pred):
        if prediction == 1:
            customer_id = lista_filtro_giorni[i]
            notifiche_giorni.append({
                "id": i + 1,
                "customer_id": customer_id,
                "message": f"Il cliente {customer_id} è a rischio abbandono, SCOPRI IL PERCHÈ"
            })
    notifiche = notifiche_giorni + notifiche_sett
    return notifiche

# SEZIONE RETENTION----------------------------------------------------------------
from fastapi import Query, HTTPException
import pandas as pd
import os
import numpy as np
import joblib
# from google import genai
# from google.genai import types
import google.generativeai as genai
from google.generativeai import types


@app.get("/retention")
def retention(customer_id: str = Query(...)):
    global df_noChurn

    if df_noChurn is None:
        raise HTTPException(status_code=500, detail="Dataset non caricato. Usa prima /modello_dataset")

    df = df_noChurn

    if customer_id not in df["customer_id"].values:
        raise HTTPException(status_code=404, detail=f"Utente {customer_id} non trovato")

    dati = "età,prezzo_abbonamento,media_presenze_sett,giorni_da_ultima_presenza,anno_iscrizione,mese_iscrizione,mese_ultima_presenza,tipo_abbonamento_encoder,sesso_F,sesso_M"
    lista = dati.split(",")

    valore_media = float(df[df["customer_id"] == customer_id]["media_presenze_sett"].values[0])
    valore_giorni = int(df[df["customer_id"] == customer_id]["giorni_da_ultima_presenza"].values[0])

    modello = model_churn
    valori = df[df["customer_id"] == customer_id][lista]
    np_valori = np.array(valori)
    pred = modello.predict(np_valori)

    if valore_media < 0.5 and valore_giorni < 20:
        messaggio = generate1(valore_media)
    elif valore_media > 0.5 and valore_giorni > 20:
        messaggio = generate2(valore_giorni)
    else:
        messaggio = generate3(valore_media, valore_giorni)

    return {
        "azione_retenzione_consigliata": messaggio,
        "churn_probabile": bool(pred[0])
    }


# -----------------------------------------------------------------------------
def generate1(valore_media):
    import google.generativeai as genai
    from fastapi import HTTPException
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Chiave API Gemini mancante (imposta GOOGLE_API_KEY o GEMINI_API_KEY)")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""Sei un esperto in retention per centri fitness. Devi suggerire in modo concreto e conciso le 3 azioni migliori per trattenere un utente specifico che vuole abbandonare la palestra.

Importantissimo: basati su questi dati statistici comprovati e su ciò che funziona davvero nel settore fitness.

Le tecniche a tua disposizione includono:
- Onboarding primi 90 giorni: 50% degli utenti inattivi abbandona entro 3 mesi. → Chiama/contatta settimanalmente, celebra piccole milestone (es. “5 sessioni”).
- Programmi personalizzati e coaching: Aumentano retention fino al 60%, raddoppiano la permanenza.
- Classi di gruppo e comunità: +26–40% retention.
- Comunicazione automatizzata: +20–30% retention con email, reminder, notifiche.
- Gamification e premi: +40% retention.
- Regalo di mesi gratuiti: nei casi più critici.

Dati utente esempio:
- media presenza settimanali: {valore_media}

Scrivi solo le 3 azioni più efficaci per questo profilo. Risposta breve, concreta e applicabile subito."""
    resp = model.generate_content(prompt)
    return (resp.text or "").strip()

# -----------------------------------------------------------------------------
def generate2(valore_giorni):
    import google.generativeai as genai
    from fastapi import HTTPException
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Chiave API Gemini mancante (imposta GOOGLE_API_KEY o GEMINI_API_KEY)")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""Sei un esperto in retention per centri fitness. Devi suggerire in modo concreto e conciso le 3 azioni migliori per trattenere un utente specifico che vuole abbandonare la palestra.

Importantissimo: basati su questi dati statistici comprovati e su ciò che funziona davvero nel settore fitness.

Le tecniche a tua disposizione includono:
- Onboarding primi 90 giorni: 50% degli utenti inattivi abbandona entro 3 mesi.
- Programmi personalizzati e coaching.
- Classi di gruppo e comunità.
- Comunicazione automatizzata.
- Gamification e premi.
- Regalo di mesi gratuiti: nei casi più critici.

Dati utente esempio:
- giorni da ultima presenza: {valore_giorni}

Scrivi solo le 3 azioni più efficaci per questo profilo. Risposta breve, concreta e applicabile subito."""
    resp = model.generate_content(prompt)
    return (resp.text or "").strip()

# -----------------------------------------------------------------------------
def generate3(valore_media, valore_giorni):
    import google.generativeai as genai
    from fastapi import HTTPException
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Chiave API Gemini mancante (imposta GOOGLE_API_KEY o GEMINI_API_KEY)")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""Sei un esperto in retention per centri fitness. Devi suggerire in modo concreto e conciso le 3 azioni migliori per trattenere un utente specifico che vuole abbandonare la palestra.

Importantissimo: basati su dati reali e strategie efficaci nel settore fitness.

Le tecniche a tua disposizione includono:
- Onboarding primi 90 giorni.
- Programmi personalizzati e coaching.
- Classi di gruppo e comunità.
- Comunicazione automatizzata.
- Gamification e premi.
- Regalo di mesi gratuiti nei casi critici.

Dati utente esempio:
- media presenza settimanali: {valore_media}
- giorni da ultima presenza: {valore_giorni}

Scrivi solo le 3 azioni più efficaci per questo profilo. Risposta breve, concreta e attuabile subito."""
    resp = model.generate_content(prompt)
    return (resp.text or "").strip()


from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

# ----------------- DB (SQLite) -----------------
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'users.db')}")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------- Security/JWT -----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 giorni

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

from pydantic import BaseModel
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str | None = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    class Config:
        from_attributes = True  # pydantic v2

class Token(BaseModel):
    access_token: str
    token_type: str

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token non valido o scaduto",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user

# ----------------- Endpoints -----------------
@app.post("/auth/register", response_model=UserOut, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email già registrata")
    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Usa form-data: username=<email>, password=<password>
@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Credenziali non valide")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user