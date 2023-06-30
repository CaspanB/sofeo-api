const { PrismaClient } = require('@prisma/client')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const logger = require('morgan')
const PORT = process.env.PORT || 3001;
const HOSTNAME = '127.0.0.1'

const prisma = new PrismaClient()
const app = express()

const isValidSessiontoken = async (sessiontoken) => {
   console.log('Requested Sessiontoken validation: ', sessiontoken)

   if(sessiontoken === null || !sessiontoken){
      return false // Sessiontoken is null or undefined, Sessiontoken is invalid
   }

   const sessiontokenInformation = await prisma.sessions.findFirst({
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

function addMinutes(date, minutes) {
   date.setMinutes(date.getMinutes() + minutes);

   return date;
}

app.use(cors())
app.use(express.json())
//app.use(logger('combined'))

app.listen(PORT, HOSTNAME, () => console.log(`Sofeo API Listening on Port ${PORT}`));

app.route('/:sessiontoken/helfer')
   .get(async (req, res) => {{
      const {sessiontoken} = req.params
      // Check Sessiontoken
      if(await isValidSessiontoken(sessiontoken)){
         // Get all helpers
         const count = await prisma.helfer.count()
         const result = await prisma.helfer.findMany()

         // Also get all users --> loginname and Berechtigungen

         console.log({
            count: count,
            data: result
         })

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
      const {sessiontoken} = req.params
      const {id, vorname, nachname, geburtstag, klasse, rufname, verfuegbareZeiten, gewuenschteAufgaben, berechtigungen} = req.body

      //Check Sessiontoken
      if(await isValidSessiontoken(sessiontoken) && vorname && nachname){
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
            const user = await prisma.benutzer.create({
               data: {
                  id: Number(id),
                  loginname: loginname,
                  passwort: String(btoa(geburtstag)),
                  berechtigungen: berechtigungenForm
               }
            })

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
            
            console.log('Created new user: ')
            console.log(result)
            console.log(user)
         }else{
            const user = await prisma.benutzer.create({
               data: {
                  loginname: loginname,
                  passwort: String(geburtstag),
                  berechtigungen: berechtigungenForm
               }
            })

            const result = await prisma.helfer.create({
               data: {
                  id: Number(user.id),
                  vorname: vorname,
                  nachname: nachname,
                  geburtstag: geburtstag,
                  klasse: klasse,
                  rufname: rufname,
                  verfuegbareZeiten: Zeiten,
                  gewuenschteAufgaben: Aufgaben
               }
            })

            console.log('Created new user: ')
            console.log(result)
            console.log(user)
         }

         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   }})

app.route('/:sessiontoken/helfer/:helferid')
   .get(async (req, res) => {
      const {sessiontoken, helferid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.helfer.findUnique({
            where: {
               id: Number(helferid)
            }
         })

         console.log(result)

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
      const {vorname, nachname, geburtstag, klasse, rufname, status, verfuegbareZeiten, gewuenschteAufgaben} = req.body
      const {sessiontoken, helferid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, helferid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const resultDeleteHelfer = await prisma.helfer.delete({
            where: {
               id: Number(helferid)
            }
         })

         const resultDeleteBenutzer = await prisma.benutzer.delete({
            where: {
               id: Number(helferid)
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

app.route('/:sessiontoken/helfer/checkin/:helferid')
   .get(async (req, res) => {
      const {sessiontoken, helferid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         // return status
         const result = await prisma.helfer.findUnique({
            where: {
               id: Number(helferid)
            },
            select: {
               status: true
            }
         })

         console.log(result)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {status} = req.body
      const {sessiontoken, helferid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         // Change status
         const result = await prisma.helfer.update({
            where: {
               id: Number(helferid)
            },
            data: {
               status: Number(status)
            }
         })
         console.log(result)

         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/:sessiontoken/lehrer')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.lehrer.count()
         const result = await prisma.lehrer.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {kuerzel, vorname, nachname} = req.body

      if(await isValidSessiontoken(sessiontoken) && kuerzel && nachname){
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

app.route('/:sessiontoken/lehrer/:lehrerkuerzel')
   .get(async (req, res) => {
      const {sessiontoken, lehrerkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken, lehrerkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, lehrerkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.lehrer.delete({
            where: {
               kuerzel: lehrerkuerzel
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

app.route('/:sessiontoken/klassen')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.klassen.count()
         const result = await prisma.klassen.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {kuerzel, klassenstufe, klasse, stand_name} = req.body

      const stand_id = await prisma.staende.findUnique({
         where: {
            name: stand_name
         }
      })

      if(await isValidSessiontoken(sessiontoken) && kuerzel && klassenstufe && klasse){
         const result = await prisma.klassen.create({
            data: {
               kuerzel: kuerzel,
               klassenstufe: Number(klassenstufe),
               klasse: klasse,
               stand_id: stand_id.id
            }
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   
app.route('/:sessiontoken/klassen/:klassenkuerzel')
   .get(async (req, res) => {
      const {sessiontoken, klassenkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken, klassenkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, klassenkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.klassen.delete({
            where: {
               kuerzel: klassenkuerzel
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

app.route('/:sessiontoken/funkgeraete')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.funkgeraete.count()
         const result = await prisma.funkgeraete.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {id, fest_id} = req.body

      if(await isValidSessiontoken(sessiontoken) && id){
         const result = await prisma.funkgeraete.create({
            data: {
               id: id,
               festid: fest_id
            }
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/:sessiontoken/funkgeraete/:funkid')
   .get(async (req, res) => {
      const {sessiontoken, funkid} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken, funkid} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, funkid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.funkgeraete.delete({
            where: {
               id: funkid
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

app.route('/:sessiontoken/aufgabentypen')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.aufgabentypen.count()
         const result = await prisma.aufgabentypen.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {name, beschreibung} = req.body

      if(await isValidSessiontoken(sessiontoken) && name){
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

app.route('/:sessiontoken/aufgabentypen/:typid')
   .get(async (req, res) => {
      const {sessiontoken, typid} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken, typid} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, typid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.aufgabentypen.delete({
            where: {
               id: Number(typid)
            }
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/:sessiontoken/staende')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.staende.count()
         const result = await prisma.staende.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {klasse, lehrer, name, position} = req.body

      if(await isValidSessiontoken(sessiontoken) && klasse){
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

app.route('/:sessiontoken/staende/:standid')
.get(async (req, res) => {
   const {sessiontoken, standid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, standid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.delete(async (req, res) => {
   const {sessiontoken, standid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.staende.delete({
         where: {
            id: Number(standid)
         }
      })
   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.route('/:sessiontoken/materialtypen')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.materialtypen.count()
         const result = await prisma.materialtypen.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {name, anzahl} = req.body

      if(await isValidSessiontoken(sessiontoken) && name){
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

app.route('/:sessiontoken/materialtypen/:typid')
.get(async (req, res) => {
   const {sessiontoken, typid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, typid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.delete(async (req, res) => {
   const {sessiontoken, typid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.materialtypen.delete({
         where: {
            id: Number(typid)
         }
      })
   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.route('/:sessiontoken/lager')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.lager.count()
         const result = await prisma.lager.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {name, position} = req.body

      if(await isValidSessiontoken(sessiontoken) && name){
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

app.route('/:sessiontoken/lager/:lagerid')
.get(async (req, res) => {
   const {sessiontoken, lagerid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, lagerid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.delete(async (req, res) => {
   const {sessiontoken, lagerid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.lager.delete({
         where: {
            id: Number(lagerid)
         }
      })
   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.route('/:sessiontoken/aufgaben')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.aufgaben.count()
         const result = await prisma.aufgaben.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {start, dauer, helfer_id, aufgabentyp_id, funk_id} = req.body

      if(await isValidSessiontoken(sessiontoken) && start && dauer && helfer_id && aufgabentyp_id){
         const result = await prisma.aufgaben.create({
            data: {
               start: new Date(start),
               dauer: Number(dauer),
               helfer_id: Number(helfer_id),
               aufgabentyp_id: Number(aufgabentyp_id),
               funk_id: String(funk_id),
               helfer: {
                  connect: {id: Number(helfer_id)}
               },
               aufgabentyp: {
                  connect: {id: Number(aufgabentyp_id)}
               },
               funkgeraet: {
                  connect: {id: String(funk_id)}
               }
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

app.get('/:sessiontoken/aufgaben/alte', async (req, res) => {
   const {sessiontoken} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      // Active tasks
      const result = await prisma.aufgaben.findMany({
         where: {
            helfer: {
               status: {
                  in: [Number(1), Number(2), Number(3)],
                  not: null
               }
            }
         },
         include: {
            helfer: {
               select: {
                  status: true,
                  vorname: true,
                  nachname: true,
                  rufname: true
               }
            },
            aufgabentyp: {
               select: {
                  name: true
               }
            },
            clone: true
         }
      })

      console.log('Aktive Aufgaben', result)

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

app.get('/:sessiontoken/aufgaben/neue', async (req, res) => {
   const {sessiontoken} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      // Non-active tasks starting in the next 10 Minutes
      const now = new Date() //today now
      const loadUntilDate = new Date(addMinutes(new Date(), 10))
      const loadFromDate = new Date(addMinutes(new Date(), -5))
      console.log(loadUntilDate)
      console.log(loadFromDate)
      
      /*const test = await prisma.aufgaben.create({
         data: {
            id: Number(2),
            start: new Date(addMinutes(new Date(), 4)),
            dauer: 36000,
            helfer_id: 4444,
            aufgabentyp_id: 8,
            funk_id: 'H1'
         }
      })
*/

      const request = await prisma.aufgaben.findMany({
         where: {
            helfer: {
               status: {
                  equals: 0
               }
            }
         },
         include: {
            helfer: {
               select: {
                  status: true,
                  vorname: true,
                  nachname: true,
                  rufname: true
               }
            },
            aufgabentyp: {
               select: {
                  name: true
               }
            },
            clone: true
         }
      })

      console.log(request)

      const result = []

      for(const [key, value] of Object.entries(request)){
         if(value.start < loadUntilDate && value.start > loadFromDate){
            result.push(value)
         }
      }

      console.log('Neue Aufgaben', result)

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

app.route('/:sessiontoken/aufgaben/:aufgabenid')
   .get(async (req, res) => {
      const {sessiontoken, aufgabenid} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken, aufgabenid} = req.params

      if(await isValidSessiontoken(sessiontoken)){

      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, aufgabenid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.aufgaben.delete({
            where: {
               id: Number(aufgabenid)
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

app.route('/:sessiontoken/materialien')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.materialien.count()
         const result = await prisma.materialien.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {lager_id, materialtyp_id, anzahl} = req.body

      if(await isValidSessiontoken(sessiontoken) && lager_id && materialtyp_id){
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

app.route('/:sessiontoken/materialien/:materialienid')
.get(async (req, res) => {
   const {sessiontoken, materialienid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, materialienid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.delete(async (req, res) => {
   const {sessiontoken, materialienid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.materialien.delete({
         where: {
            id: Number(materialienid)
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

app.route('/:sessiontoken/materialienausgabe')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.materialienausgabe.count()
         const result = await prisma.materialienausgabe.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {stand_id, lager_id, materialtyp_id, anzahl} = req.body

      if(await isValidSessiontoken(sessiontoken) && stand_id && lager_id && materialtyp_id){
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

app.route('/:sessiontoken/materialienausgabe/:ausgabeid')
.get(async (req, res) => {
   const {sessiontoken, ausgabeid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, ausgabeid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.delete(async (req, res) => {
   const {sessiontoken, ausgabeid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.materialienausgabe.delete({
         where: {
            id: Number(ausgabeid)
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

app.route('/:sessiontoken/mitteilungen')
   .get(async (req, res) => {
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const count = await prisma.mitteilungen.count()
         const result = await prisma.mitteilungen.findMany()

         console.log(result)

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
      const {sessiontoken} = req.params
      const {mitteilung, empfaenger} = req.body

      if(await isValidSessiontoken(sessiontoken) && mitteilung && empfaenger){
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

app.route('/:sessiontoken/mitteilungen/:mitteilungsid')
.get(async (req, res) => {
   const {sessiontoken, mitteilungsid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, mitteilungsid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.delete(async (req, res) => {
   const {sessiontoken, mitteilungsid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.mitteilungen.delete({
         where: {
            id: Number(mitteilungsid)
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

app.get('/', async (req, res) => {
   console.log('Get API Server Information')

   res.json({
      name: 'Sofeo API',
      version: 'v1.0',
      author: 'Hannah Brandt'
   })
})


app.post('/benutzer/login', async (req, res) => {
   const {loginname, passwort} = req.body
   //passwort base-64 codiert

   console.log(loginname)
   console.log(passwort)

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

app.get('/:sessiontoken/benutzer/logout', async (req, res) => {
   // Delete sessiontoken
   const {sessiontoken} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.sessions.delete({
         where: {
            id: sessiontoken
         }
      })

      console.log('Logged out user with sessiontoken: ', sessiontoken)

      res.status(200)
   }else{
      console.log('Invalid Sessiontoken')
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.put('/:sessiontoken/benutzer/:id/:passwort', async (req, res) => {
   const {sessiontoken, id, passwort} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.benutzer.update({
         where: {
            id: Number(id),
         },
         data: {
            passwort: passwort,
         },
      })
   
      res.status(200)
      console.log(result)
   }else{
      res.status(404)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }

})