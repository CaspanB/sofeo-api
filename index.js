const { PrismaClient } = require('@prisma/client')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const PORT = 3001;

const prisma = new PrismaClient()
const app = express()

const isValidSessiontoken = async (sessiontoken) => {
   const sessiontokenInformation = await prisma.sessions.findFirstOrThrow({
      where: {
         id: sessiontoken
      }
   })

   if(sessiontokenInformation){
      return true; // Sessiontoken exists in database
   }else{
      return false; // Sessiontoken does not exist in database
   }
}

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log(`Sofeo API Listening on Port ${PORT}`));

app.route('/benutzer/:benutzerId')
   .get(async (req, res) => {
      const {benutzerId} = req.params

      const result = await prisma.benutzer.findUnique({
         where: {
            id: Number(benutzerId)
         }
      })
   
      res.status(200)
      res.json(result)
   })
   .put(async (req, res) => {
      const {benutzerId} = req.params
      const {passwort} = req.body

      if(passwort){
         const result = await prisma.benutzer.update({
            where: {
               id: benutzerId
            },
            data: {
               passwort: passwort
            }
         })
      }else {
         // Auf Standard Passwort zurücksetzen
      }
   })

app.route('/helfer')
   .get(async (req, res) => {{
      const {sessiontoken} = req.body
      // Check Sessiontoken
      if(isValidSessiontoken(sessiontoken)){
         // Get all helpers
         const count = await prisma.helfer.count()
         const result = await prisma.helfer.findMany()

         // Also get all users --> loginname and Berechtigungen

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   }})
   .post(async (req, res) => {{
      const {sessiontoken, id, vorname, nachname, geburtstag, klasse, rufname, verfuegbareZeiten, gewuenschteAufgaben, berechtigungen} = req.body
      //Check Sessiontoken
      if(isValidSessiontoken(sessiontoken) && vorname && nachname){
         let Zeiten = []
         if(verfuegbareZeiten)
            Zeiten = verfuegbareZeiten
         let Aufgaben = []
         if(gewuenschteAufgaben)
            Aufgaben = gewuenschteAufgaben

         let berechtigungenForm = [0,1,0,0]
         if(berechtigungen)
            berechtigungenForm = Array.from(String(berechtigungen), Number)

         const loginname = vorname.toLowerCase() + '.' + nachname.toLowerCase()

         if(id){
            const result = await prisma.helfer.create({
               data: {
                  id: Number(id),
                  vorname: vorname,
                  nachname: nachname,
                  geburtstag: geburtstag,
                  klasse: klasse,
                  rufname: rufname,
                  verfuegbareZeiten: Zeiten,
                  gewuenschteAufgaben: Aufgaben
               }
            })

            const user = await prisma.benutzer.create({
               data: {
                  id: Number(id),
                  loginname: loginname,
                  passwort: String(geburtstag),
                  berechtigungen: berechtigungenForm
               }
            })
         }else{
            const result = await prisma.helfer.create({
               data: {
                  vorname: vorname,
                  nachname: nachname,
                  geburtstag: geburtstag,
                  klasse: klasse,
                  rufname: rufname,
                  verfuegbareZeiten: Zeiten,
                  gewuenschteAufgaben: Aufgaben
               }
            })

            const user = await prisma.benutzer.create({
               data: {
                  id: Number(id),
                  loginname: loginname,
                  passwort: String(geburtstag),
                  berechtigungen: berechtigungenForm
               }
            })
         }
         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   }})

app.route('/helfer/:helferId')
   .get(async (req, res) => {
      const {sessiontoken} = req.body
      const {helferId} = req.params
      if(isValidSessiontoken(sessiontoken)){
         const result = await prisma.helfer.findUnique({
            where: {
               id: benutzerId
            }
         })
         res.status(200)
         res.json({
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken} = req.body
   })
app.route('/klassen')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.klassen.count()
         const result = await prisma.klassen.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, kuerzel, klassenstufe, klasse, stand_id} = req.body

      if(isValidSessiontoken(sessiontoken) && kuerzel && klassenstufe && klasse){
         const result = await prisma.klassen.create({
            data: {
               kuerzel: kuerzel,
               klassenstufe: Number(klassenstufe),
               klasse: klasse,
               stand_id: stand_id
            }
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
app.route('/klassen/:klassenKuerzel')

app.route('/lehrer')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.lehrer.count()
         const result = await prisma.lehrer.findMany()
         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404),
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, kuerzel, vorname, nachname} = req.body
      if(isValidSessiontoken(sessiontoken) && kuerzel && nachname){
         const result = await prisma.lehrer.create({
            data: {
               kuerzel: kuerzel,
               vorname: vorname,
               nachname: nachname
            }
         })

         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/funkgeraete')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.funkgeraete.count()
         const result = await prisma.funkgeraete.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, id, festid} = req.body

      if(isValidSessiontoken(sessiontoken) && id){
         const result = await prisma.funkgeraete.create({
            data: {
               id: id,
               festid: festid
            }
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/aufgabentypen')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.aufgabentypen.count()
         const result = await prisma.aufgabentypen.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, name, beschreibung} = req.body

      if(isValidSessiontoken(sessiontoken) && name){
         const result = await prisma.funkgeraete.create({
            data: {
               name: name,
               beschreibung: beschreibung
            }
         })
         
         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/staende')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.staende.count()
         const result = await prisma.staende.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, klasse, lehrer, name, position} = req.body

      if(isValidSessiontoken(sessiontoken) && klasse){
         const result = await prisma.staende.create({
            data: {
               klasse: klasse,
               lehrer: lehrer,
               name: name,
               position: position
            }
         })

         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/materialtypen')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.materialtypen.count()
         const result = await prisma.materialtypen.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, name, anzahl} = req.body

      if(isValidSessiontoken(sessiontoken) && name){
         const result = await prisma.materialtypen.create({
            data: {
               name: name,
               anzahl: Number(anzahl)
            }
         })
         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/lager')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.lager.count()
         const result = await prisma.lager.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         req.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, name, position} = req.body

      if(isValidSessiontoken(sessiontoken) && name){
         const result = await prisma.lager.create({
            data:{
               name: name,
               position: position
            }
         })

         req.status(200)
      }else{
         res.status(404)
         req.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/aufgaben')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.aufgaben.count()
         const result = await prisma.aufgaben.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, start, dauer, helfer_id, aufgabentyp_id, funk_id} = req.body

      if(isValidSessiontoken(sessiontoken) && start && dauer && helfer_id && aufgabentyp_id){
         const result = await prisma.aufgaben.create({
            data: {
               start: start,
               dauer: Number(dauer),
               helfer_id: Number(helfer_id),
               aufgabentyp_id: Number(aufgabentyp_id),
               funk_id: funk_id
            }
         })
         const aufgaben_id = result.id
         
         const connectHelfer = await prisma.helfer.update({
            where: {
               id: Number(helfer_id)
            },
            data: {
               aufgaben: {
                  connect: {id: Number(aufgaben_id)}
               }
            }
         })

         const connectAufgabentyp = await prisma.aufgabentypen.update({
            where: {
               id: Number(aufgabentyp_id)
            },
            data: {
               aufgaben: {
                  connect: {id: Number(aufgaben_id)}
               }
            }
         })

         if(funk_id){
            const connnectFunkgeraet = await prisma.funkgeraete.update({
               where: {
                  id: funk_id
               },
               data: {
                  aufgaben: {
                     connect: {id: Number(aufgaben_id)}
                  }
               }
            })
         }

         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })


app.route('/materialien')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.materialien.count()
         const result = await prisma.materialien.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, lager_id, materialtyp_id, anzahl} = req.body

      if(isValidSessiontoken(sessiontoken) && lager_id && materialtyp_id){
         const result = await prisma.materialien.create({
            data: {
               lager_id: Number(lager_id),
               materialtyp_id: Number(materialtyp_id),
               anzahl: Number(anzahl)
            }
         })

         const material_id = result.id

         const connectLager = await prisma.lager.update({
            where: {
               id: Number(lager_id)
            },
            data: {
               materialien: {
                  connect: {id: Number(material_id)}
               }
            }
         })

         const connectMaterialtyp = await prisma.materialtypen.update({
            where: {
               id: Number(materialtyp_id)
            },
            data: {
               materialien: {
                  connect: {id: Number(material_id)}
               }
            }
         })

         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/materialienausgabe')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.materialienausgabe.count()
         const result = await prisma.materialienausgabe.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, stand_id, lager_id, materialtyp_id, anzahl} = req.body

      if(isValidSessiontoken(sessiontoken) && stand_id && lager_id && materialtyp_id){
         const result = await prisma.materialienausgabe.create({
            data: {
               stand_id: Number(stand_id),
               lager_id: Number(lager_id),
               materialtyp_id: Number(materialtyp_id),
               anzahl: Number(anzahl)
            }
         })

         const materialienausgabe_id = result.id

         const connectStand = await prisma.staende.update({
            where: {
               id: Number(stand_id)
            },
            data: {
               materialienausgabe: {
                  connect: {id: Number(materialienausgabe_id)}
               }
            }
         })

         const connectLager = await prisma.lager.update({
            where: {
               id: Number(lager_id)
            },
            data: {
               materialienausgabe: {
                  connect: {id: Number(materialienausgabe_id)}
               }
            }
         })

         const connectMaterialtyp = await prisma.materialtypen.update({
            where: {
               id: Number(materialtyp_id)
            },
            data: {
               materialienausgabe: {
                  connect: {id: Number(materialienausgabe_id)}
               }
            }
         })

         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/mitteilungen')
   .get(async (req, res) => {
      const {sessiontoken} = req.body

      if(isValidSessiontoken(sessiontoken)){
         const count = await prisma.mitteilungen.count()
         const result = await prisma.mitteilungen.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken, mitteilung, empfaenger} = req.body

      if(isValidSessiontoken(sessiontoken) && mitteilung && empfaenger){
         const result = await prisma.mitteilungen.create({
            data: {
               mitteilung: mitteilung,
               empfaenger: empfaenger
            }
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   
app.get('/', async (req, res) => {
   res.json({
      name: 'Sofeo API',
      version: 'v1.0',
      author: 'Hannah Brandt'
   })
})


app.post('/benutzer/login', async (req, res) => {
   const {loginname, passwort} = req.body
   //passwort base-64 codiert

   const databaseRes = await prisma.benutzer.findFirst({
      where: {
         loginname: loginname,
         passwort: passwort
      }
   })

   console.log(databaseRes)

   if(databaseRes != null){
      // Create session token
      const sessiontoken = uuid.v4()

      const createSession = await prisma.sessions.create({
         data: {
            id: sessiontoken,
            benutzer_id: Number(databaseRes.id),
         },
      })

      console.log({sessiontoken: sessiontoken, id: Number(databaseRes.id), berechtigungen: databaseRes.berechtigungen})

      // Send result: {sessiontoken, benutzer_id, berechtigungen}
      res.json({
         sessiontoken: sessiontoken,
         id: Number(databaseRes.id),
         berechtigungen: databaseRes.berechtigungen,
      })
   }else{
      res.status(400)
      res.json({
         error: 'Invalid Username or Password'
      })
   }
})

app.get('/benutzer/logout/:sessiontoken', async (req, res) => {
   // Delete sessiontoken
   const {sessiontoken} = req.params

   const result = await prisma.sessions.delete({
      where: {
         id: sessiontoken
      }
   })

   res.status(200)
})

app.put('/benutzer/:id/:passwort', async (req, res) => {
   const {id, passwort} = req.params

   const result = await prisma.benutzer.update({
      where: {
         id: Number(id),
      },
      data: {
         passwort: passwort,
      },
   })

   res.status(200)
   res.json(result)
})