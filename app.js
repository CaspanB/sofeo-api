/*
 * Programmer: Cemisis/Elonat
 * Version: Alpha 0.1
 * Project: Sofeo API
 * 
 * start nodemon with npx nodemon app.js
*/
const PORT = 8000;

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries')
const Sequelize = require('sequelize');

const app = express();
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
/*
//#region region Sequelize Model Declaration
const sequelize = new Sequelize('postgres:sofeo.sql');

const user = sequelize.define('users', {
    user_id:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.DataTypes.STRING
    },
    loginname:{
        type: Sequelize.DataTypes.STRING
    },
    area_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    }
})

const helper = sequelize.define('helper', {
    helper_id:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    firstname:{
        type: Sequelize.DataTypes.STRING
    },
    lastname:{
        type: Sequelize.DataTypes.STRING
    },
    birthday:{
        type: Sequelize.DataTypes.STRING
    },
    class:{
        type: Sequelize.DataTypes.STRING
    },
    callsign:{
        type: Sequelize.DataTypes.STRING
    },
    gender_id:{
        type: Sequelize.DataTypes.INTEGER
    },
    team_id:{
        type: Sequelize.DataTypes.INTEGER
    },
    preferredtask:{
        type: Sequelize.DataTypes.STRING
    },
    hastime:{
        type: Sequelize.DataTypes.STRING
    }
})

const teacher = sequelize.define('teacher', {
    abbreviation:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    lastname:{
        type: Sequelize.DataTypes.STRING
    },
    assignement:{
        type: Sequelize.DataTypes.STRING
    },
    class:{
        type: Sequelize.DataTypes.STRING
    },
    gender_id:{
        type: Sequelize.DataTypes.INTEGER
    }
})

const gender = sequelize.define('gender', {
    gender_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: Sequelize.DataTypes.STRING
    }
})

const area = sequelize.define('area', {
    area_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: Sequelize.DataTypes.STRING
    }
})

const team = sequelize.define('team', {
    team_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: Sequelize.DataTypes.STRING
    }
})

const assignement = sequelize.define('assignment', {
    assignement_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    startsat:{
        type: Sequelize.DataTypes.STRING
    },
    endsat:{
        type: Sequelize.DataTypes.STRING
    },
    duration:{
        type: Sequelize.DataTypes.INTEGER
    },
    description:{
        type: Sequelize.DataTypes.STRING
    },
    helper_id:{
        type: Sequelize.DataTypes.STRING
    },
    status_id:{
        type: Sequelize.DataTypes.INTEGER
    },
    wt_id:{
        type: Sequelize.DataTypes.STRING
    },
    task_id:{
        type: Sequelize.DataTypes.INTEGER
    }
})

const wt = sequelize.define('walkietalkie', {
    wt_id:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    owner_id:{
        type: Sequelize.DataTypes.STRING
    },
    fixed_id:{
        type: Sequelize.DataTypes.STRING
    },
    channel_id:{
        type: Sequelize.DataTypes.INTEGER
    },
    status_id:{
        type: Sequelize.DataTypes.INTEGER
    }
})

const channel = sequelize.define('channel', {
    channel_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: Sequelize.DataTypes.STRING
    },
    frequency:{
        type: Sequelize.DataTypes.INTEGER
    }
})

const status = sequelize.define('status', {
    status_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: Sequelize.DataTypes.STRING
    }
})

const task = sequelize.define('task', {
    task_id:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: Sequelize.DataTypes.STRING
    }
})

//#endregionendregion
*/
// CRUD

app.get('/', (req, res)=>{
    res.json({ info: 'Node.js, Express, and Postgres API' });
})

app.get('/area', db.getAllAreas) //Get all areas
app.get('/area/:areaId', db.getArea) //Get specific area
app.post('/area', db.createArea) //Create area
app.put('/area', db.editAllAreas) //Edit all areas
app.put('/area/:areaId', db.editArea) //Edit specific area
app.delete('/area', db.deleteAllAreas) //Delete all areas
app.delete('/area/:areaId', db.deleteArea) //Delete specific area

app.get('/gender', db.getAllGenders) //Get all genders
app.get('/gender/:genderId', db.getGender) //Get specific gender
app.post('/gender', db.createGender) //Create gender
app.put('/gender', db.editAllGenders) //Edit all genders
app.put('/gender/:genderId', db.editGender) //Edit specific gender
app.delete('/gender', db.deleteAllGenders) //Delete all genders
app.delete('/gender/:genderId', db.deleteGender) //Delete specific gender

app.get('/team', db.getAllTeams) //Get all teams
app.get('/team/:teamId', db.getTeam) //Get specific team
app.post('/team', db.createTeam) //Create team
app.put('/team', db.editAllTeams) //Edit all teams
app.put('/team/:teamId', db.editTeam) //Edit specific team
app.delete('/team', db.deleteAllTeams) //Delete all teams
app.delete('/team/:teamId', db.deleteTeam) //Delete specific team

app.get('/channel', db.getAllChannels) //Get all channels
app.get('/channel/:channelId', db.getChannel) //Get specific channel
app.post('/channel', db.createChannel) //Create channel
app.put('/channel', db.editAllChannels) //Edit all channels
app.put('/channel/:channelId', db.editChannel) //Edit specific channel
app.delete('/channel', db.deleteAllChannels) //Delete all channels
app.delete('/channel/:channelId', db.deleteChannel) //Delete specific channel

app.get('/status', db.getAllStatuses) //Get all statuses
app.get('/status/:statusId', db.getStatus) //Get specific status
app.post('/status', db.createStatus) //Create status
app.put('/status', db.editAllStatuses) //Edit all statuses
app.put('/status/:statusId', db.editStatus) //Edit specific status
app.delete('/status', db.deleteAllStatuses) //Delete all statuses
app.delete('/status/:statusId', db.deleteStatus) //Delete specific status

app.get('/type', db.getAllTypes) //Get all types
app.get('/type/:typeId', db.getType) //Get specific type
app.post('/type', db.createType) //Create type
app.put('/type', db.editAllTypes) //Edit all types
app.put('/type/:typeId', db.editType) //Edit specific type
app.delete('/type', db.deleteAllTypes) //Delete all types
app.delete('/type/:typeId', db.deleteType) //Delete specific type

app.get('/class', db.getAllClasses) //Get all classes
app.get('/class/:classId-:grade', db.getClass) //Get specific class
app.post('/class', db.createClass) //Create class
app.put('/class', db.editAllClasses) //Edit all classes
app.put('/class/:classId', db.editClass) //Edit specific class
app.delete('/class', db.deleteAllClasses) //Delete all classes
app.delete('/class/:classId', db.deleteClass) //Delete specific class

app.get('/stand', db.getAllStands) //Get all stands
app.get('/stand/:standId', db.getStand) //Get specific stand
app.post('/stand', db.createStand) //Create stand
app.put('/stand', db.editAllStands) //Edit all stands
app.put('/stand/:standId', db.editStand) //Edit specific stand
app.delete('/stand', db.deleteAllStands) //Delete all stands
app.delete('/stand/:standId', db.deleteStand) //Delete specific stand

app.get('/storagelocation', db.getAllStoragelocations) //Get all storagelocations
app.get('/storagelocation/:storagelocationId', db.getStoragelocation) //Get specific storagelocation
app.post('/storagelocation', db.createStoragelocation) //Create storagelocation
app.put('/storagelocation', db.editAllStoragelocations) //Edit all storagelocations
app.put('/storagelocation/:storagelocationId', db.editStoragelocation) //Edit specific storagelocation
app.delete('/storagelocation', db.deleteAllStoragelocations) //Delete all storagelocations
app.delete('/storagelocation/:storagelocationId', db.deleteStoragelocation) //Delete specific storagelocation

app.get('/users', db.getAllUsers) //Get all users
app.get('/users/:usersId', db.getUser) //Get specific user
app.post('/users', db.createUser) //Create user
app.put('/users', db.editAllUsers) //Edit all users
app.put('/users/:usersId', db.editUser) //Edit specific user
app.delete('/users', db.deleteAllUsers) //Delete all users
app.delete('/users/:usersId', db.deleteUser) //Delete specific user

app.get('/helper', db.getAllHelpers) //Get all helpers
app.get('/helper/:helperId', db.getHelper) //Get specific helper
app.post('/helper', db.createHelper) //Create helper
app.put('/helper', db.editAllHelpers) //Edit all helpers
app.put('/helper/:helperId', db.editHelper) //Edit specific helper
app.delete('/helper', db.deleteAllHelpers) //Delete all helpers
app.delete('/helper/:helperId', db.deleteHelper) //Delete specific helper
app.put('/helper/:helperId/:checkinStatus', db.changeHelperStatus) //Change status of helper

app.get('/teacher', db.getAllTeachers) //Get all teachers
app.get('/teacher/:teacherId', db.getTeacher) //Get specific teacher
app.post('/teacher', db.createTeacher) //Create teacher
app.put('/teacher', db.editAllTeachers) //Edit all teachers
app.put('/teacher/:teacherId', db.editTeacher) //Edit specific teacher
app.delete('/teacher', db.deleteAllTeachers) //Delete all teachers
app.delete('/teacher/:teacherId', db.deleteTeacher) //Delete specific teacher

app.get('/assignment', db.getAllAssignments) //Get all assignments
app.get('/assignment/:assignmentId', db.getAssignment) //Get specific assignment
app.post('/assignment', db.createAssignment) //Create assignment
app.put('/assignment', db.editAllAssignments) //Edit all assignments
app.put('/assignment/:assignmentId', db.editAssignment) //Edit specific assignment
app.delete('/assignment', db.deleteAllAssignments) //Delete all assignments
app.delete('/assignment/:assignmentId', db.deleteAssignment) //Delete specific assignment

app.get('/walkeitalkie', db.getAllWalkietalkies) //Get all walkeitalkies
app.get('/walkeitalkie/:walkeitalkieId', db.getWalkietalkie) //Get specific walkeitalkie
app.post('/walkeitalkie', db.createWalkietalkie) //Create walkeitalkie
app.put('/walkeitalkie', db.editAllWalkietalkies) //Edit all walkeitalkies
app.put('/walkeitalkie/:walkeitalkieId', db.editWalkietalkie) //Edit specific walkeitalkie
app.delete('/walkeitalkie', db.deleteAllWalkietalkies) //Delete all walkeitalkies
app.delete('/walkeitalkie/:walkeitalkieId', db.deleteWalkietalkie) //Delete specific walkeitalkie
app.put('/walkietalkie/:walkietalkieId/:checkinStatus', db.changeWalkietalkieStatus) //Change walkietalkie status

app.get('/classrepresentative', db.getAllClassrepresentatives) //Get all classrepresentatives
app.get('/classrepresentative/:classrepresentativeId', db.getClassrepresentative) //Get specific classrepresentative
app.post('/classrepresentative', db.createClassrepresentative) //Create classrepresentative
app.put('/classrepresentative', db.editAllClassrepresentatives) //Edit all classrepresentatives
app.put('/classrepresentative/:classrepresentativeId', db.editClassrepresentative) //Edit specific classrepresentative
app.delete('/classrepresentative', db.deleteAllClassrepresentatives) //Delete all classrepresentatives
app.delete('/classrepresentative/:classrepresentativeId', db.deleteClassrepresentative) //Delete specific classrepresentative

app.get('/material', db.getAllMaterials) //Get all materials
app.get('/material/:materialId', db.getMaterial) //Get specific material
app.post('/material', db.createMaterial) //Create material
app.put('/material', db.editAllMaterials) //Edit all materials
app.put('/material/:materialId', db.editMaterial) //Edit specific material
app.delete('/material', db.deleteAllMaterials) //Delete all materials
app.delete('/material/:materialId', db.deleteMaterial) //Delete specific material

app.get('/classmaterial/:classrepresentativeId', db.getAllClassMaterials) //Get all materials of a specific class
app.get('/classmaterial/:classrepresentativeId/:materialId', db.getClassMaterial) //Get specific material of a specific class
app.post('/classmaterial/:classrepresentativeId/:materialId', db.createClassMaterial) //Link a material id with a class
app.put('/classmaterial/:classrepresentativeId/:materialId', db.editClassMaterial) //Give over new material id to change material id
app.put('/classmaterial/:materialId', db.editClassMaterialId) //Give over new class, change class of the material
app.delete('/classmaterial', db.deleteAllClassMaterials) //Delete all Links
app.delete('/classmaterial/:classrepresentativeId', db.deleteClassMaterial) //Delete Link based on class (classrepresentative id)
app.delete('/classmaterial/:materialId', db.deleteClassMaterialId) //Delete Link based on material id

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});
