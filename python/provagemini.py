# To run this code you need to install the following dependencies:
# pip install google-genai
import pandas as pd
import base64
import os
from google import genai
from google.genai import types
import joblib
import numpy as np

df = pd.read_csv("df_noChurn.csv")
df.head()

utente = "CUST0110" 

dati = "età,prezzo_abbonamento,media_presenze_sett,giorni_da_ultima_presenza,anno_iscrizione,mese_iscrizione,mese_ultima_presenza,tipo_abbonamento_encoder,sesso_F,sesso_M"
lista = dati.split(",")

modello = joblib.load("/home/matteo/matteo/programmazione/saaschurnpalestre/python/modello_churn.pkl")

valore_media = df[df["customer_id"] == utente]["media_presenze_sett"].values
valore_giorni = df[df["customer_id"] == utente]["giorni_da_ultima_presenza"].values
print(valore_media)
if valore_media < 0.5 and valore_giorni < 20:
    valori = df[df["customer_id"]==utente][lista]
    np_valori = np.array(valori)
    pred = modello.predict(np_valori)
    print(f"il modello ipotizza che l'utente {utente} potrebbe abbandonandonare la palestra perchè ha una media presenze settimanali troppo bassa, più precisamente {valore_media}. Bisogna fare un lavoro mirato per evitare che abbandoni")
elif valore_media > 0.5 and valore_giorni > 20:
    valori = df[df["customer_id"]==utente][lista]
    np_valori = np.array(valori)
    pred = modello.predict(np_valori)
    print(f"il modello ipotizza che l'utente {utente} potrebbe abbandonare perchè non si presenta da {valore_giorni} giorni. Bisogna fare un lavoro mirato per evitare che abbandoni")
else:
    valori = df[df["customer_id"]==utente][lista]
    np_valori = np.array(valori)
    pred = modello.predict(np_valori)
    print(f"il modello ipotizza che l'utente {utente} potrebbe abbandonandonare la palestra perchè ha una media presenze settimanali troppo bassa, più precisamente {valore_media}, e anche perchè non si presenta da {valore_giorni} giorni. Bisogna fare un lavoro mirato per evitare che abbandoni")


def generate1():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.5-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""Sei un esperto in retention per centri fitness. Devi suggerire in modo concreto e conciso le 3 azioni migliori per trattenere un utente specifico che vuole abbandonare la palestra.

    Importantissimo: basati su questi dati statistici comprovati e su ciò che funziona davvero nel settore fitness.

    Le tecniche a tua disposizione includono:

        Onboarding primi 90 giorni: 50% degli utenti inattivi abbandona entro 3 mesi. → Chiama/contatta settimanalmente, celebra piccole milestone (es. “5 sessioni”).

        Programmi personalizzati e coaching: Aumentano retention fino al 60%, raddoppiano la permanenza. → Offri check-up, piani individuali, progress tracking.

        Classi di gruppo e comunità: +26–40% retention. → Organizza sfide mensili, eventi social, premi visibili.

        Comunicazione costante e automatizzata: +20–30% retention con email, reminder, notifiche. → Notifiche per chi frequenta poco, promo mirate.

        Gamification e programmi fedeltà: +40% retention con badge, punti, premi. → Crea leaderboard, premi reali (lezioni gratuite, gadget).

        Regalo di mesi gratuiti nei casi più critici: Offrilo quando il rischio abbandono è massimo.

    Ora ti fornisco i dati utente. Voglio una risposta in elenco, breve e attuabile, 3 punti massimo, scritti per un proprietario che ha poco tempo ma vuole agire subito.

    Dati utente esempio 
    media presenza settimanali: {valore_media}



    Scrivi solo le 3 azioni più efficaci per questo profilo."""),
            ],
        ),
    ]
    tools = [
        types.Tool(googleSearch=types.GoogleSearch(
        )),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget=-1,
        ),
        tools=tools,
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")
# ----------------------------------------------------------------------------------------------------------------
def generate2():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.5-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""Sei un esperto in retention per centri fitness. Devi suggerire in modo concreto e conciso le 3 azioni migliori per trattenere un utente specifico che vuole abbandonare la palestra.

    Importantissimo: basati su questi dati statistici comprovati e su ciò che funziona davvero nel settore fitness.

    Le tecniche a tua disposizione includono:

        Onboarding primi 90 giorni: 50% degli utenti inattivi abbandona entro 3 mesi. → Chiama/contatta settimanalmente, celebra piccole milestone (es. “5 sessioni”).

        Programmi personalizzati e coaching: Aumentano retention fino al 60%, raddoppiano la permanenza. → Offri check-up, piani individuali, progress tracking.

        Classi di gruppo e comunità: +26–40% retention. → Organizza sfide mensili, eventi social, premi visibili.

        Comunicazione costante e automatizzata: +20–30% retention con email, reminder, notifiche. → Notifiche per chi frequenta poco, promo mirate.

        Gamification e programmi fedeltà: +40% retention con badge, punti, premi. → Crea leaderboard, premi reali (lezioni gratuite, gadget).

        Regalo di mesi gratuiti nei casi più critici: Offrilo quando il rischio abbandono è massimo.

    Ora ti fornisco i dati utente. Voglio una risposta in elenco, breve e attuabile, 3 punti massimo, scritti per un proprietario che ha poco tempo ma vuole agire subito.

    Dati utente esempio 
    giorni da ultima presenza: {valore_giorni}



    Scrivi solo le 3 azioni più efficaci per questo profilo."""),
            ],
        ),
    ]
    tools = [
        types.Tool(googleSearch=types.GoogleSearch(
        )),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget=-1,
        ),
        tools=tools,
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

# ----------------------------------------------------------------------------------------------------------------

def generate3():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.5-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""Sei un esperto in retention per centri fitness. Devi suggerire in modo concreto e conciso le 3 azioni migliori per trattenere un utente specifico che vuole abbandonare la palestra.

    Importantissimo: basati su questi dati statistici comprovati e su ciò che funziona davvero nel settore fitness.

    Le tecniche a tua disposizione includono:

        Onboarding primi 90 giorni: 50% degli utenti inattivi abbandona entro 3 mesi. → Chiama/contatta settimanalmente, celebra piccole milestone (es. “5 sessioni”).

        Programmi personalizzati e coaching: Aumentano retention fino al 60%, raddoppiano la permanenza. → Offri check-up, piani individuali, progress tracking.

        Classi di gruppo e comunità: +26–40% retention. → Organizza sfide mensili, eventi social, premi visibili.

        Comunicazione costante e automatizzata: +20–30% retention con email, reminder, notifiche. → Notifiche per chi frequenta poco, promo mirate.

        Gamification e programmi fedeltà: +40% retention con badge, punti, premi. → Crea leaderboard, premi reali (lezioni gratuite, gadget).

        Regalo di mesi gratuiti nei casi più critici: Offrilo quando il rischio abbandono è massimo.

    Ora ti fornisco i dati utente. Voglio una risposta in elenco, breve e attuabile, 3 punti massimo, scritti per un proprietario che ha poco tempo ma vuole agire subito.

    Dati utente esempio 
    media presenza settimanali: {valore_media}
    giorni da ultima presenza: {valore_giorni}



    Scrivi solo le 3 azioni più efficaci per questo profilo."""),
            ],
        ),
    ]
    tools = [
        types.Tool(googleSearch=types.GoogleSearch(
        )),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget=-1,
        ),
        tools=tools,
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    if valore_media < 0.5 and valore_giorni < 20:
        generate1()
    elif valore_media > 0.5 and valore_giorni > 20:
        generate2()
    else:
        generate3()
    
    
