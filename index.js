import { PrismaClient } from '@prisma/client'
import express from 'express'
import {v4 as uuidv4} from 'uuid'
import cors from 'cors'
import logger from 'morgan'
import fetch from 'node-fetch'
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

const compareArrays = (a, b) => {
   return a.toString() === b.toString()
   // return JSON.stringify(a) === JSON.stringify(b);
};

app.use(cors())
app.use(express.json())
//app.use(logger('combined'))

app.listen(PORT, HOSTNAME, () => console.log(`Sofeo API Listening on Port ${PORT}`));

app.get('/', async (req, res) => {
   console.log('Get API Server Information')

   res.json({
      name: 'Sofeo API',
      version: 'v1.0',
      author: 'Hannah Brandt'
   })
})

app.route('/:sessiontoken/benutzer')
   .get(async (req, res) => {{
      const {sessiontoken} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const helfer = await prisma.helfer.findMany()
         const benutzer = await prisma.benutzer.findMany({
            orderBy: {
               loginname: 'asc'
            }
         })
         
         const result = []

         for (let indexBenutzer = 0; indexBenutzer < benutzer.length; indexBenutzer++) {
            const elementBenutzer = benutzer[indexBenutzer];
            for (let indexHelfer = 0; indexHelfer < helfer.length; indexHelfer++) {
               const elementHelfer = helfer[indexHelfer];
               if(elementBenutzer.id === elementHelfer.id){
                  result.push({
                     id: elementHelfer.id,
                     vorname: elementHelfer.vorname,
                     nachname: elementHelfer.nachname,
                     rufname: elementHelfer.rufname,
                     loginname: elementBenutzer.loginname,
                     geburtstag: elementHelfer.geburtstag,
                     klasse: elementHelfer.klasse,
                     verfuegbareZeiten: elementHelfer.verfuegbareZeiten,
                     gewuenschteAufgaben: elementHelfer.gewuenschteAufgaben,
                     berechtigungen: elementBenutzer.berechtigungen,
                  })
               }
            }
         }

         console.log(result)

         res.status(200)
         res.json({
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   }})

app.route('/:sessiontoken/helfer')
   .get(async (req, res) => {{
      const {sessiontoken} = req.params
      // Check Sessiontoken
      if(await isValidSessiontoken(sessiontoken)){
         // Get all helpers
         const count = await prisma.helfer.count()
         const result = await prisma.helfer.findMany({
            orderBy: {
               rufname: 'asc'
            },
            include: {
               aufgaben: {
                  include: {
                     aufgabentyp: true,
                     funkgeraet: true,
                     helfer: true
                  },
                  orderBy: {
                     start: 'asc'
                  }
               }
            },
            orderBy: {
               vorname: 'asc'
            }
         })

         // Also get all users --> loginname and Berechtigungen
         // NO NO - do a seperate one for users

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
         res.status(401)
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
         if(gewuenschteAufgaben && gewuenschteAufgaben != "")
            Aufgaben = gewuenschteAufgaben.split(',')

         let berechtigungenForm = [0,1,0,0]
         if(berechtigungen)
            berechtigungenForm = berechtigungen

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
                  vorname: vorname.toLowerCase(),
                  nachname: nachname.toLowerCase(),
                  geburtstag: geburtstag,
                  klasse: klasse,
                  rufname: rufname.toLowerCase(),
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
                  passwort: String(btoa(geburtstag)),
                  berechtigungen: berechtigungenForm
               }
            })

            const result = await prisma.helfer.create({
               data: {
                  id: Number(user.id),
                  vorname: vorname.toLowerCase(),
                  nachname: nachname.toLowerCase(),
                  geburtstag: geburtstag,
                  klasse: klasse,
                  rufname: rufname.toLowerCase(),
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
         res.status(401)
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
            },
            include: {
               aufgaben: {
                  include: {
                     aufgabentyp: true,
                     funkgeraet: true
                  },
                  orderBy: {
                     start: 'asc'
                  }
               }
            }
         })

         console.log(result)

         res.status(200)
         res.json(result)
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {vorname, nachname, geburtstag, klasse, rufname, verfuegbareZeiten, gewuenschteAufgaben, berechtigungen} = req.body
      const {sessiontoken, helferid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const helfer = await prisma.helfer.findUnique({
            where: {
               id: Number(helferid)
            }
         })
         const benutzer = await prisma.benutzer.findUnique({
            where: {
               id: Number(helferid)
            }
         })

         const helferUpdate = {}
         const benutzerUpdate = {}

         if(vorname && helfer.vorname !== vorname.toLowerCase()){
            helferUpdate.vorname = vorname.toLowerCase()
            benutzerUpdate.loginname = `${vorname.toLowerCase()}.${nachname.toLowerCase()}`
         }

         if(nachname && helfer.nachname !== nachname.toLowerCase()){
            helferUpdate.nachname = nachname.toLowerCase()
            benutzerUpdate.loginname = `${vorname.toLowerCase()}.${nachname.toLowerCase()}`
         }

         if(((rufname && helfer.rufname) && (helfer.rufname !== rufname.toLowerCase())) || (rufname && !helfer.rufname)){
            helferUpdate.rufname = rufname.toLowerCase()
         }
         
         if(geburtstag && helfer.geburtstag !== geburtstag){
            helferUpdate.geburtstag = geburtstag
            if(benutzer.passwort === btoa(helfer.geburtstag)){
               benutzerUpdate.passwort = btoa(geburtstag)
            }
         }
         
         if(((klasse && helfer.klasse) && (helfer.klasse !== klasse)) || (klasse && !helfer.klasse)){
            helferUpdate.klasse = klasse
         }
         
         if(verfuegbareZeiten && !compareArrays(verfuegbareZeiten, helfer.verfuegbareZeiten)){
            helferUpdate.verfuegbareZeiten = verfuegbareZeiten
         }
         
         if(gewuenschteAufgaben && !compareArrays(gewuenschteAufgaben, helfer.gewuenschteAufgaben)){
            helferUpdate.gewuenschteAufgaben = gewuenschteAufgaben
         }
         
         if(berechtigungen && !compareArrays(benutzer.berechtigungen, berechtigungen)){
            benutzerUpdate.berechtigungen = berechtigungen
         }

         console.log('Helferupdate: ', helferUpdate)
         console.log('Benutzerupdate: ', benutzerUpdate)

         const resultUser = await prisma.benutzer.update({
            where: {
               id: Number(helferid)
            },
            data: benutzerUpdate
         })

         const resultHelfer = await prisma.helfer.update({
            where: {
               id: Number(helferid)
            },
            data: helferUpdate
         })
         
         console.log(resultUser)
         console.log(resultHelfer)

         res.status(200)
      }else{
         res.status(401)
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
         res.status(401)
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
         const result = await prisma.lehrer.findMany({
            include: {
               staende: {
                  include: {
                     klasse: true
                  }
               }
            },
            orderBy: {
               kuerzel: 'asc'
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401),
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {kuerzel, vorname, nachname, anrede} = req.body

      if(await isValidSessiontoken(sessiontoken) && kuerzel && nachname && anrede){
         const result = await prisma.lehrer.create({
            data: {
               kuerzel: kuerzel,
               vorname: vorname,
               nachname: nachname,
               anrede: anrede
            }
         })

         res.status(200)
      }else{
         res.status(401)
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
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {kuerzel, vorname, nachname, anrede} = req.body
      const {sessiontoken, lehrerkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const lehrer = await prisma.lehrer.findUnique({
            where: {
               kuerzel: lehrerkuerzel
            }
         })
         
         const lehrerUpdate = {}
         
         if(kuerzel && kuerzel !== lehrer.kuerzel){
            lehrerUpdate.kuerzel = kuerzel
         }

         if(((vorname && lehrer.vorname) && (vorname.toLowerCase() !== lehrer.vorname.toLowerCase())) || (vorname && !lehrer.vorname)){
            lehrerUpdate.vorname = vorname.toLowerCase()
         }

         if(nachname && nachname.toLowerCase() !== lehrer.nachname.toLowerCase()){
            lehrerUpdate.nachname = nachname.toLowerCase()
         }

         if(anrede && anrede !== lehrer.anrede){
            lehrerUpdate.anrede = anrede
         }
         
         console.log('Lehrerupdate: ', lehrerUpdate)
         
         const result = await prisma.lehrer.update({
            where: {
               kuerzel: lehrerkuerzel
            },
            data: lehrerUpdate
         })

         console.log(result)

         res.status(200)
      }else{
         res.status(401)
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
         res.status(401)
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
         const result = await prisma.klassen.findMany({
            include: {
               stand: {
                  include: {
                     lehrer: true
                  }
               }
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {kuerzel, klassenstufe, klasse} = req.body

      if(await isValidSessiontoken(sessiontoken) && kuerzel && klassenstufe && klasse){
         const result = await prisma.klassen.create({
            data: {
               kuerzel: kuerzel,
               klassenstufe: Number(klassenstufe),
               klasse: klasse
            }
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   
app.route('/:sessiontoken/klassen/:klassenkuerzel')
   .get(async (req, res) => {
      const {sessiontoken, klassenkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.klassen.findUnique({
            where: {
               kuerzel: klassenkuerzel
            },
            include: {
               stand: {
                  include: {
                     klasse: true,
                     lehrer: true,
                     materialienausgabe: {
                        include: {
                           lager: true,
                           materialtyp: true
                        }
                     }
                  }
               }
            }
         })

         console.log('klasse: ', result)
         res.status(200)
         if(result){
            res.json(result)
         }else{
            res.json({})
         }
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {kuerzel, klassenstufe, klasse} = req.body
      const {sessiontoken, klassenkuerzel} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const resKlasse = await prisma.klassen.findUnique({
            where: {
               kuerzel: klassenkuerzel
            }
         })
         
         const klassenUpdate = {}
         
         if(kuerzel && kuerzel !== resKlasse.kuerzel){
            klassenUpdate.kuerzel = kuerzel
         }
         
         if(klassenstufe && Number(klassenstufe) !== Number(resKlasse.klassenstufe)){
            klassenUpdate.klassenstufe = Number(klassenstufe)
         }
         
         if(klasse && klasse !== resKlasse.klasse){
            klassenUpdate.klasse = klasse
         }
         
         console.log('Klassenupdate: ', klassenUpdate)
         
         const result = await prisma.klassen.update({
            where: {
               kuerzel: klassenkuerzel
            },
            data: klassenUpdate
         })

         console.log(result)

         res.status(200)
      }else{
         res.status(401)
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
         res.status(401)
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
         const result = await prisma.funkgeraete.findMany({
            orderBy: {
               id: 'asc'
            },
            include: {
               aufgaben: {
                  include: {
                     aufgabentyp: true,
                     funkgeraet: true,
                     helfer: true
                  },
                  orderBy: {
                     start: 'asc'
                  }
               }
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {id} = req.body

      if(await isValidSessiontoken(sessiontoken) && id){
         const result = await prisma.funkgeraete.create({
            data: {
               id: id
            }
         })
      }else{
         res.status(401)
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
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {id} = req.body
      const {sessiontoken, funkid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const funkgeraet = await prisma.funkgeraete.findUnique({
            where: {
               id: funkid
            }
         })
         
         const funkgeraetUpdate = {}
         
         if(id && funkgeraet.id !== id){
            funkgeraetUpdate.id = id
         }
         
         console.log('Funkgerätupdate: ', funkgeraetUpdate)
         
         const result = await prisma.funkgeraete.update({
            where: {
               id: id
            },
            data: funkgeraetUpdate
         })

         console.log(result)

         res.status(200)
      }else{
         res.status(401)
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
         res.status(401)
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
         const result = await prisma.aufgabentypen.findMany({
            include: {
               aufgaben: {
                  include: {
                     helfer: true,
                     aufgabentyp: true,
                     funkgeraet: true
                  }
               }
            },
            orderBy: {
               id: 'asc'
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {name, beschreibung} = req.body

      if(await isValidSessiontoken(sessiontoken) && name){
         const result = await prisma.aufgabentypen.create({
            data: {
               name: name,
               beschreibung: beschreibung
            }
         })
         
         res.status(200)
      }else{
         res.status(401)
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
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken, typid} = req.params
      const {name, beschreibung} = req.body

      if(await isValidSessiontoken(sessiontoken)){
         const aufgabentyp = await prisma.aufgabentypen.findUnique({
            where: {
               id: Number(typid)
            }
         })

         const aufgabentypUpdate = {}

         if(name && name.toLowerCase() !== aufgabentyp.name.toLowerCase()){
            aufgabentypUpdate.name = name
         }

         if(((beschreibung && aufgabentyp.beschreibung) && beschreibung.toLowerCase() !== aufgabentyp.beschreibung.toLowerCase()) || (beschreibung && !aufgabentyp.beschreibung)){
            aufgabentypUpdate.beschreibung = beschreibung
         }else if(!beschreibung && aufgabentyp.beschreibung){
            aufgabentypUpdate.beschreibung = String()
         }
         
         console.log('Aufgabentypupdate: ', aufgabentypUpdate)
         
         const result = await prisma.aufgabentypen.update({
            where: {
               id: Number(typid)
            },
            data: aufgabentypUpdate
         })

         console.log(result)

         res.status(200)
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, typid} = req.params

      console.log(req)

      if(await isValidSessiontoken(sessiontoken)){
         const result = await prisma.aufgabentypen.delete({
            where: {
               id: Number(typid)
            }
         })
      }else{
         res.status(401)
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
         const result = await prisma.staende.findMany({
            orderBy: {
               klasse: {
                  kuerzel: 'asc'
               }
            },
            include: {
               klasse: true,
               lehrer: true
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {klasse, lehrer, name, position} = req.body

      if(await isValidSessiontoken(sessiontoken)){

         const stand = {
            name: name
         }

         if(position){
            stand.position = postition
         }

         if(klasse){
            stand.klassen_kuerzel = klasse
         }

         if(lehrer){
            stand.lehrer_kuerzel = lehrer
         }

         const result = await prisma.staende.create({
            data: stand
         })

         res.status(200)
      }else{
         res.status(401)
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
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {name, position, klasse, lehrer} = req.body
   const {sessiontoken, standid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const stand = await prisma.staende.findUnique({
         where: {
            id: Number(standid)
         }
      })
      
      const standUpdate = {}
      
      if(name && name.toLowerCase() !== stand.name.toLowerCase()){
         standUpdate.name = name
      }

      if(((position && stand.position) && (position !== stand.position)) || (position && !stand.position)){
         standUpdate.position = position
      }

      if(((stand.klasse && klasse) && (klasse !== stand.klasse.kuerzel)) || (klasse && !stand.klasse)){
         standUpdate.klassen_kuerzel = klasse
      }

      if(((stand.lehrer && lehrer) && (lehrer !== stand.lehrer.kuerzel)) || (lehrer && !stand.lehrer)){
         standUpdate.lehrer_kuerzel = lehrer
      }
      
      console.log('Standupdate: ', standUpdate)
      
      const result = await prisma.staende.update({
         where: {
            id: Number(standid)
         },
         data: standUpdate
      })

      console.log(result)

      res.status(200)
   }else{
      res.status(401)
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

      res.status(200)
   }else{
      res.status(401)
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
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {name, beschreibung} = req.body

      if(await isValidSessiontoken(sessiontoken) && name){
         const materialtyp = {
            name: name
         }

         if(beschreibung){
            materialtyp.beschreibung = beschreibung
         }

         const result = await prisma.materialtypen.create({
            data: materialtyp
         })
         res.status(200)
      }else{
         res.status(401)
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
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, typid} = req.params
   const {name, beschreibung} = req.body

   if(await isValidSessiontoken(sessiontoken)){
      const materialtyp = await prisma.materialtypen.findUnique({
         where: {
            id: Number(typid)
         }
      })

      const materialtypUpdate = {}

      if(name && name.toLowerCase() !== materialtyp.name.toLowerCase()){
         materialtypUpdate.name = name
      }

      if((beschreibung && materialtyp.beschreibung) && beschreibung !== materialtyp.beschreibung || beschreibung && !materialtyp.beschreibung){
         materialtypUpdate.beschreibung = beschreibung
      }else if(!beschreibung && materialtyp.beschreibung){
         materialtypUpdate.beschreibung = String()
      }

      console.log('Materialtypupdate: ', materialtypUpdate)

      const result = await prisma.materialtypen.update({
         where: {
            id: Number(typid)
         },
         data: materialtypUpdate
      })

      console.log(result)
      res.status(200)
   }else{
      res.status(401)
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
      res.status(401)
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
         const result = await prisma.lager.findMany({
            include: {
               materialienausgabe: {
                  include: {
                     stand: {
                        include: {
                           klasse: true,
                           lehrer: true
                        }
                     },
                     lager: true,
                     materialtyp: {
                        include: {
                           materialien: true
                        }
                     }
                  }
               },
               materialien: {
                  include: {
                     materialtyp: true
                  }
               }
            },
            orderBy: {
               name: 'asc'
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
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

         res.status(200)
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/:sessiontoken/lager/:lagerid')
.get(async (req, res) => {
   const {sessiontoken, lagerid} = req.params

   if(await isValidSessiontoken(sessiontoken)){

   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, lagerid} = req.params
   const {name, postition} = req.body

   if(await isValidSessiontoken(sessiontoken)){

      const lager = await prisma.lager.findUnique({
         where: {
            id: Number(lagerid)
         }
      })
      
      const lagerUpdate = {}
      
      if(name && lager.name.toLowerCase() !== name.toLowerCase()){
         lagerUpdate.name = name
      }

      if(((postition && lager.position) && (lager.position !== postition)) || (postition && !lager.position)){
         lagerUpdate.position = postition
      }else if(!postition && lager.position){
         lagerUpdate.position = String()
      }
      
      console.log('Lagerupdate: ', lagerUpdate)
      
      const result = await prisma.lager.update({
         where: {
            id: Number(lagerid)
         },
         data: lagerUpdate
      })

      console.log(result)

      res.status(200)
   }else{
      res.status(401)
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
      res.status(401)
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
         const result = await prisma.aufgaben.findMany({
            orderBy: [
               {
                  start: 'asc'
               },
               {
                  aufgabentyp: {
                     name: 'asc'
                  }
               }
            ],
            include: {
               helfer: true,
               aufgabentyp: true,
               funkgeraet: true
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {start, ende, helfer_id, aufgabentyp_id, funk_id, parent_id, status} = req.body

      console.log(req.body)

      if(await isValidSessiontoken(sessiontoken) && start && ende && helfer_id && aufgabentyp_id){
         console.log('/aufgaben')
         if(parent_id){
            const getParent = await prisma.aufgaben.findUnique({
               where: {
                  id: Number(parent_id)
               }
            })

            if(getParent.parent_id === null){
               const result = await prisma.aufgaben.create({
                  data: {
                     start: new Date(start),
                     ende: new Date(ende),
                     status: Number(status),
                     helfer_id: Number(helfer_id),
                     aufgabentyp_id: Number(aufgabentyp_id),
                     funk_id: String(funk_id),
                     parent_id: Number(parent_id)
                  }
               })

               const changeParent = await prisma.aufgaben.update({
                  where: {
                     id: Number(parent_id)
                  },
                  data: {
                     clone_id: result.id
                  }
               })

               console.log(result)
            }else{
               const result = await prisma.aufgaben.create({
                  data: {
                     start: new Date(start),
                     ende: new Date(ende),
                     status: Number(status),
                     helfer_id: Number(helfer_id),
                     aufgabentyp_id: Number(aufgabentyp_id),
                     funk_id: String(funk_id),
                     parent_id: Number(getParent.parent_id)
                  }
               })

               const changeParent = await prisma.aufgaben.update({
                  where: {
                     id: Number(getParent.parent_id)
                  },
                  data: {
                     clone_id: result.id
                  }
               })

               const deleteMiddleClone = await prisma.aufgaben.delete({
                  where: {
                     id: Number(parent_id)
                  }
               })
               
               console.log(result)
            }
         }else{
            if(funk_id){
               const result = await prisma.aufgaben.create({
                  data: {
                     start: new Date(start),
                     ende: new Date(ende),
                     status: Number(status),
                     helfer_id: Number(helfer_id),
                     aufgabentyp_id: Number(aufgabentyp_id),
                     funk_id: String(funk_id)
                  }
               })
            }else{
               const result = await prisma.aufgaben.create({
                  data: {
                     start: new Date(start),
                     ende: new Date(ende),
                     status: Number(status),
                     helfer_id: Number(helfer_id),
                     aufgabentyp_id: Number(aufgabentyp_id)
                  }
               })
            }
         }

         res.status(200)
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/:sessiontoken/aufgaben/checkin/:aufgabenid')
   .get(async (req, res) => {
      const {sessiontoken, aufgabenid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         // return status
         console.log('/aufgaben/checkin/aufgabenid')
         const result = await prisma.aufgaben.findUnique({
            where: {
               id: Number(aufgabenid)
            },
            select: {
               status: true
            }
         })

         console.log(result)
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {status} = req.body
      const {sessiontoken, aufgabenid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         // Change status
         const result = await prisma.aufgaben.update({
            where: {
               id: Number(aufgabenid)
            },
            data: {
               status: Number(status)
            }
         })
         console.log(result)

         res.status(200)
      }else{
         res.status(401)
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
            status: {
               in: [Number(1), Number(2), Number(3)]
            }
         },
         include: {
            helfer: {
               select: {
                  vorname: true,
                  nachname: true,
                  rufname: true
               }
            },
            aufgabentyp: true
         },
         orderBy: {
            start: 'asc'
         }
      })

      console.log('Aktive Aufgaben', result)

      res.status(200)
      res.json({
         data: result
      })
   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.get('/:sessiontoken/aufgaben/neue/:tag', async (req, res) => {
   const {sessiontoken, tag} = req.params

   if(await isValidSessiontoken(sessiontoken)){
     let sommerfesttag = new Date(tag);

      // Non-active tasks starting in the next 10 Minutes
      const now = new Date() //today now
      const request = await prisma.aufgaben.findMany({
         where: {
            status: {
                  equals: 0
            }
         },
         include: {
            helfer: {
               select: {
                  vorname: true,
                  nachname: true,
                  rufname: true
               }
            },
            aufgabentyp: {
               select: {
                  name: true
               }
            }
         },
         orderBy: {
            start: 'asc'
         }
      })
      
      console.log(request)
      console.log('Sommerfesttag: ', sommerfesttag)

      const result = []
      
      if(new Date(sommerfesttag).toDateString() === now.toDateString()){
         const loadUntilDate = new Date(addMinutes(new Date(), 30))
         const loadFromDate = new Date(addMinutes(new Date(), -5))
         // console.log(loadUntilDate)
         // console.log(loadFromDate)

         for(const [key, value] of Object.entries(request)){
            if(value.start < loadUntilDate && value.start > loadFromDate){
               result.push(value)
            }
         }
      }else if(request.length > 0){
         const start = new Date(request[0].start)
         start.setMilliseconds(0)
         start.setSeconds(0)

         for(const [key, value] of Object.entries(request)){
            const aufgabeStart = new Date(value.start)
            aufgabeStart.setMilliseconds(0)
            aufgabeStart.setSeconds(0)

            if(aufgabeStart.toTimeString() === start.toTimeString() && new Date(sommerfesttag).toDateString() === new Date(aufgabeStart).toDateString()){
               result.push(value)
            }
         }
      }

      console.log('Neue Aufgaben', result)

      res.status(200)
      res.json({
         data: result
      })
   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.route('/:sessiontoken/aufgaben/:aufgabenid')
   .get(async (req, res) => {
      const {sessiontoken, aufgabenid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         console.log('/aufgaben/aufgabenid, get')
         const result = await prisma.aufgaben.findUnique({
            where: {
               id: Number(aufgabenid)
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken, aufgabenid} = req.params
      const {start, ende, status, helfer_id, aufgabentyp_id, funk_id} = req.body

      if(await isValidSessiontoken(sessiontoken)){
         console.log('/aufgaben/aufgabenid')
         const aufgabe = await prisma.aufgaben.findUnique({
            where: {
               id: Number(aufgabenid)
            }
         })

         const aufgabenUpdate = {}

         if(start && start !== aufgabe.start){
            aufgabenUpdate.start = start
         }

         if(ende && ende !== aufgabe.ende){
            aufgabenUpdate.ende = ende
         }

         if(status && Number(status) !== aufgabe.status){
            aufgabenUpdate.status = Number(status)
         }

         if(helfer_id && Number(helfer_id) !== aufgabe.helfer_id){
            aufgabenUpdate.helfer_id = Number(helfer_id)
         }

         if(aufgabentyp_id && Number(aufgabentyp_id) !== aufgabe.aufgabentyp_id){
            aufgabenUpdate.aufgabentyp_id = Number(aufgabentyp_id)
         }

         if(((funk_id && aufgabe.funk_id) && funk_id !== aufgabe.funk_id) || funk_id && !aufgabe.funk_id){
            aufgabenUpdate.funk_id = funk_id
         }

         console.log('Aufgabenupdate: ', aufgabenUpdate)

         const result = await prisma.aufgaben.update({
            where: {
               id: Number(aufgabenid)
            },
            data: aufgabenUpdate
         })

         console.log(result)
         res.status(200)
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .delete(async (req, res) => {
      const {sessiontoken, aufgabenid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const getParent = await prisma.aufgaben.findUnique({
            where: {
               id: Number(aufgabenid)
            }
         })

         if(getParent.parent_id === null){
            const result = await prisma.aufgaben.delete({
               where: {
                  id: Number(aufgabenid)
               }
            })
         }else{
            const result = await prisma.aufgaben.deleteMany({
               where: {
                  AND: [
                     {id: Number(aufgabenid)},
                     {id: Number(getParent.parent_id)}
                  ]
               }
            })
         }

         res.status(200)
      }else{
         res.status(401)
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
         const result = await prisma.materialien.findMany({
            include: {
               lager: true,
               materialtyp: true
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {lager_id, materialtyp_id, anzahl} = req.body

      if(await isValidSessiontoken(sessiontoken) && lager_id && materialtyp_id){
         const material = {
            lager_id: Number(lager_id),
            materialtyp_id: Number(materialtyp_id)
         }

         if(anzahl){
            material.anzahl = Number(anzahl)
         }else{
            material.anzahl = 0
         }

         const result = await prisma.materialien.create({
            data: material
         })

         console.log(result)

         res.status(200)
      }else{
         res.status(401)
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
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, materialienid} = req.params
   const {lager_id, materialtyp_id, anzahl} = req.body

   if(await isValidSessiontoken(sessiontoken)){
      const material = await prisma.materialien.findUnique({
         where: {
            id: Number(materialienid)
         }
      })

      const materialUpdate = {}

      if(lager_id && Number(lager_id) !== Number(material.lager_id)){
         materialUpdate.lager_id = Number(lager_id)
      }

      if(materialtyp_id && Number(materialtyp_id) !== Number(material.materialtyp_id)){
         materialUpdate.materialtyp_id = Number(materialtyp_id)
      }

      if((anzahl && material.anzahl && Number(anzahl) !== Number(material.anzahl)) || (anzahl && !material.anzahl)){
         materialUpdate.anzahl = Number(anzahl)
      }else if(!anzahl && material.anzahl){
         materialUpdate.anzahl = 0
      }

      console.log('Materialupdate: ', materialUpdate)

      if(Object.keys(materialUpdate).length > 0){
         const result = await prisma.materialien.update({
            where: {
               id: Number(materialienid)
            },
            data: materialUpdate
         })

         console.log(result)

         res.status(200)
      }else{
         res.status(400)
      }
   }else{
      res.status(401)
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
      res.status(401)
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
         const result = await prisma.materialienausgabe.findMany({
            include: {
               lager: true,
               materialtyp: true,
               stand: {
                  include: {
                     klasse: true,
                     lehrer: true
                  }
               }
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .post(async (req, res) => {
      const {sessiontoken} = req.params
      const {stand_id, lager_id, materialtyp_id, anzahl} = req.body

      if(await isValidSessiontoken(sessiontoken) && stand_id && lager_id && materialtyp_id){
         const materialausgabe = {
            stand_id: Number(stand_id),
            lager_id: Number(lager_id),
            materialtyp_id: Number(materialtyp_id)
         }

         if(anzahl){
            materialausgabe.anzahl = Number(anzahl)
         }else{
            materialausgabe.anzahl = 0
         }

         const result = await prisma.materialienausgabe.create({
            data: materialausgabe
         })

         console.log(result)

         res.status(200)
      }else{
         res.status(401)
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
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, ausgabeid} = req.params
   const {stand_id, lager_id, materialtyp_id, anzahl} = req.body

   if(await isValidSessiontoken(sessiontoken)){
      const materialausgabe = await prisma.materialienausgabe.findUnique({
         where: {
            id: Number(ausgabeid)
         }
      })

      const materialausgabeUpdate = {}

      if(lager_id && Number(lager_id) !== Number(materialausgabe.lager_id)){
         materialUpdate.lager_id = Number(lager_id)
      }

      if(materialtyp_id && Number(materialtyp_id) !== Number(materialausgabe.materialtyp_id)){
         materialUpdate.materialtyp_id = Number(materialtyp_id)
      }

      if(stand_id && Number(stand_id) !== Number(materialausgabe.materialtyp_id)){
         materialausgabeUpdate.stand_id = Number(stand_id)
      }

      if((anzahl && materialausgabe.anzahl && Number(anzahl) !== Number(materialausgabe.anzahl)) || (anzahl && !materialausgabe.anzahl)){
         materialUpdate.anzahl = Number(anzahl)
      }else if(!anzahl && materialausgabe.anzahl){
         materialUpdate.anzahl = 0
      }

      console.log('Materialienausgabeupdate: ', materialausgabeUpdate)

      if(Object.keys(materialausgabeUpdate).length > 0){
         const result = await prisma.materialienausgabe.update({
            where: {
               id: Number(ausgabeid)
            },
            data: materialausgabeUpdate
         })

         console.log(result)
         res.status(200)
      }else{
         res.status(400)
      }
   }else{
      res.status(401)
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
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.route('/:sessiontoken/mitteilungen/benutzer/:helferid')
   .get(async (req, res) => {
      const {sessiontoken, helferid} = req.params

      if(await isValidSessiontoken(sessiontoken)){
         const getPerms = await prisma.benutzer.findUnique({
            where: {
               id: Number(helferid)
            }
         })

         const perms = []

         for (let index = 0; index < getPerms.berechtigungen.length; index++) {
            const element = getPerms.berechtigungen[index];
            if(element === 1){
               perms.push(index-1)
            }
         }
         console.log('Perms: ', perms)

         const count = await prisma.mitteilungen.count()
         const result = await prisma.mitteilungen.findMany({
            where: {
               empfaenger: {
                  in: perms
               }
            }
         })

         console.log(result)

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(401)
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
         res.status(401)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })

app.route('/:sessiontoken/mitteilungen/admin')
.get(async (req, res) => {
   const {sessiontoken} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const count = await prisma.mitteilungen.count()
      const result = await prisma.mitteilungen.findMany({
         orderBy: {
            name: 'asc'
         }
      })

      console.log(result)

      res.status(200)
      res.json({
         count: count,
         data: result
      })
   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.post(async (req, res) => {
   const {sessiontoken} = req.params
   const {name, mitteilung, empfaenger} = req.body

   console.log(req.body)

   if(await isValidSessiontoken(sessiontoken) && name && mitteilung && empfaenger >= 0){
      const result = await prisma.mitteilungen.create({
         data: {
            name: name,
            mitteilung: mitteilung,
            empfaenger: Number(empfaenger)
         }
      })
   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.route('/:sessiontoken/mitteilungen/admin/:mitteilungsid')
.get(async (req, res) => {
   const {sessiontoken, mitteilungsid} = req.params

   if(await isValidSessiontoken(sessiontoken)){
      const result = await prisma.mitteilungen.findUnique({
         where: {
            id: Number(mitteilungsid)
         }
      })

      console.log(result)

      res.status(200)
      res.json(result)
   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})
.put(async (req, res) => {
   const {sessiontoken, mitteilungsid} = req.params
   const {name, mitteilungContent, empfaenger} = req.body

   if(await isValidSessiontoken(sessiontoken)){
      const mitteilung = await prisma.mitteilungen.findUnique({
         where: {
            id: Number(mitteilungsid)
         }
      })
      const mitteilungUpdate = {}

      if(name && name.toLowerCase() !== mitteilung.name.toLowerCase()){
         mitteilungUpdate.name = name
      }

      if(mitteilungContent && mitteilungContent.toLowerCase() !== mitteilung.mitteilung.toLowerCase()){
         mitteilungUpdate.mitteilung = mitteilungContent
      }
      
      if(empfaenger && Number(empfaenger) !== Number(mitteilung.empfaenger)){
         mitteilungUpdate.empfaenger = Number(empfaenger)
      }

      console.log('Mitteilungsupdate: ', mitteilungUpdate)

      const result = await prisma.mitteilungen.update({
         where: {
            id: Number(mitteilungsid)
         },
         data: mitteilungUpdate
      })

      console.log(result)
      res.status(200)
   }else{
      res.status(401)
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
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
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
      const sessiontoken = uuidv4()

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
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.put('/:sessiontoken/benutzer/:userid', async (req, res) => {
   const {sessiontoken, userid} = req.params
   const {altespasswort, neuespasswort} = req.body

   if(await isValidSessiontoken(sessiontoken)){
      if(altespasswort, neuespasswort){
         const checkPassword = await prisma.benutzer.findFirst({
            where: {
               id: Number(userid),
               passwort: altespasswort
            }
         })

         if(checkPassword){
            const result = await prisma.benutzer.update({
               where: {
                  id: Number(userid),
               },
               data: {
                  passwort: neuespasswort,
               },
            })
   
            console.log(result)
         }else{
            res.status(400)
            res.json({
               error: 'Invalid old password'
            })
         }
      }else{
         const helfer = await prisma.helfer.findUnique({
            where: {
               id: Number(userid)
            }
         })

         const result = await prisma.benutzer.update({
            where: {
               id: Number(userid),
            },
            data: {
               passwort: btoa(helfer.geburtstag),
            },
         })

         console.log(result)
      }
   
      res.status(200)
   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})

app.get('/einstellungen', async (req, res) => {
   const count = await prisma.einstellungen.count()
   const result = await prisma.einstellungen.findMany()

   console.log(result)

   res.status(200)
   res.json({
      count: count,
      data: result
   })
})

app.put('/:sessiontoken/einstellungen/:einstellungid', async (req, res) => {
   const {sessiontoken, einstellungid} = req.params
   const {value} = req.body

   if(await isValidSessiontoken(sessiontoken) && value){
      const result = await prisma.einstellungen.update({
         where: {
            id: Number(einstellungid)
         },
         data: {
            value: value
         }
      })

      console.log(result)

      res.status(200)
   }else{
      res.status(401)
      res.json({
         error: 'Invalid Sessiontoken'
      })
   }
})