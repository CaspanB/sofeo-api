/*
 * Programmer: Cemisis/Elonat
 * Version: Alpha 0.1
 * Project: Sofeo API
*/
const { request } = require('express'); // ?
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sofeo',
    password: 'postgres',
    port: 5430,
})

const getAllAreas = (request, response) => {
    pool.query('SELECT * FROM area ORDER BY area_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getArea = (request, response) => {
    const id = request.params.areaId;
    pool.query('SELECT * FROM area WHERE area_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createArea = (request, response) => {
    const { name } = request.body;
    let id = 0;
    pool.query('SELECT * FROM area ORDER BY area_id DESC', (error, results) => {
        if(error){
            throw error
        }
        id = results.rows[0].area_id;
    })

    const query = 'INSERT INTO area VALUES ($1, $2) RETURNING *';
    pool.query(query, [id, name], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Create Area $1', [id]);
    })
}

const editAllAreas = (request, response) => {
    
}

const editArea = (request, response) => {
    
}

const deleteAllAreas = (request, response) => {
    
}

const deleteArea = (request, response) => {
    
}

const getAllGenders = (request, response) => {
    
}

const getGender = (request, response) => {
    
}

const createGender = (request, response) => {
    
}

const editAllGenders = (request, response) => {
    
}

const editGender = (request, response) => {
    
}

const deleteAllGenders = (request, response) => {
    
}

const deleteGender = (request, response) => {
    
}

const getAllTeams = (request, response) => {
    
}

const getTeam = (request, response) => {
    
}

const createTeam = (request, response) => {
    
}

const editAllTeams = (request, response) => {
    
}

const editTeam = (request, response) => {
    
}

const deleteAllTeams = (request, response) => {
    
}

const deleteTeam = (request, response) => {
    
}

const getAllChannels = (request, response) => {
    
}

const getChannel = (request, response) => {
    
}

const createChannel = (request, response) => {
    
}

const editAllChannels = (request, response) => {
    
}

const editChannel = (request, response) => {
    
}

const deleteAllChannels = (request, response) => {
    
}

const deleteChannel = (request, response) => {
    
}

const getAllStatuses = (request, response) => {
    
}

const getStatus = (request, response) => {
    
}

const createStatus = (request, response) => {
    
}

const editAllStatuses = (request, response) => {
    
}

const editStatus = (request, response) => {
    
}

const deleteAllStatuses = (request, response) => {
    
}

const deleteStatus = (request, response) => {
    
}

const getAllTypes = (request, response) => {
    
}

const getType = (request, response) => {
    
}

const createType = (request, response) => {
    
}

const editAllTypes = (request, response) => {
    
}

const editType = (request, response) => {
    
}

const deleteAllTypes = (request, response) => {
    
}

const deleteType = (request, response) => {
    
}

const getAllClasses = (request, response) => {
    
}

const getClass = (request, response) => {
    
}

const createClass = (request, response) => {
    
}

const editAllClasses = (request, response) => {
    
}

const editClass = (request, response) => {
    
}

const deleteAllClasses = (request, response) => {
    
}

const deleteClass = (request, response) => {
    
}

const getAllStands = (request, response) => {
    
}

const getStand = (request, response) => {
    
}

const createStand = (request, response) => {
    
}

const editAllStands = (request, response) => {
    
}

const editStand = (request, response) => {
    
}

const deleteAllStands = (request, response) => {
    
}

const deleteStand = (request, response) => {
    
}

const getAllStoragelocations = (request, response) => {
    
}

const getStoragelocation = (request, response) => {
    
}

const createStoragelocation = (request, response) => {
    
}

const editAllStoragelocations = (request, response) => {
    
}

const editStoragelocation = (request, response) => {
    
}

const deleteAllStoragelocations = (request, response) => {
    
}

const deleteStoragelocation = (request, response) => {
    
}

const getAllUsers = (request, response) => {
    
}

const getUser = (request, response) => {
    
}

const createUser = (request, response) => {
    
}

const editAllUsers = (request, response) => {
    
}

const editUser = (request, response) => {
    
}

const deleteAllUsers = (request, response) => {
    
}

const deleteUser = (request, response) => {
    
}

const getAllHelpers = (request, response) => {
    
}

const getHelper = (request, response) => {
    
}

const createHelper = (request, response) => {
    
}

const editAllHelpers = (request, response) => {
    
}

const editHelper = (request, response) => {
    
}

const deleteAllHelpers = (request, response) => {
    
}

const deleteHelper = (request, response) => {
    
}

const changeHelperStatus = (request, response) => {

}

const getAllTeachers = (request, response) => {
    
}

const getTeacher = (request, response) => {
    
}

const createTeacher = (request, response) => {
    
}

const editAllTeachers = (request, response) => {
    
}

const editTeacher = (request, response) => {
    
}

const deleteAllTeachers = (request, response) => {
    
}

const deleteTeacher = (request, response) => {
    
}

const getAllAssignments = (request, response) => {
    
}

const getAssignment = (request, response) => {
    
}

const createAssignment = (request, response) => {
    
}

const editAllAssignments = (request, response) => {
    
}

const editAssignment = (request, response) => {
    
}

const deleteAllAssignments = (request, response) => {
    
}

const deleteAssignment = (request, response) => {
    
}

const getAllWalkietalkies = (request, response) => {
    
}

const getWalkietalkie = (request, response) => {
    
}

const createWalkietalkie = (request, response) => {
    
}

const editAllWalkietalkies = (request, response) => {
    
}

const editWalkietalkie = (request, response) => {
    
}

const deleteAllWalkietalkies = (request, response) => {
    
}

const deleteWalkietalkie = (request, response) => {
    
}

const changeWalkietalkieStatus = (request, response) => {

}

const getAllClassrepresentatives = (request, response) => {
    
}

const getClassrepresentative = (request, response) => {
    
}

const createClassrepresentative = (request, response) => {
    
}

const editAllClassrepresentatives = (request, response) => {
    
}

const editClassrepresentative = (request, response) => {
    
}

const deleteAllClassrepresentatives = (request, response) => {
    
}

const deleteClassrepresentative = (request, response) => {
    
}

const getAllMaterials = (request, response) => {
    
}

const getMaterial = (request, response) => {
    
}

const createMaterial = (request, response) => {
    
}

const editAllMaterials = (request, response) => {
    
}

const editMaterial = (request, response) => {
    
}

const deleteAllMaterials = (request, response) => {
    
}

const deleteMaterial = (request, response) => {
    
}


/*
Get Request
(request, response) => {
    pool.query('', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
*/


module.exports = {
    getAllAreas,
    getArea,
    createArea,
    editAllAreas,
    editArea,
    deleteAllAreas,
    deleteArea,
    getAllGenders,
    getGender,
    createGender,
    editAllGenders,
    editGender,
    deleteAllGenders,
    deleteGender,
    getAllTeams,
    getTeam,
    createTeam,
    editAllTeams,
    editTeam,
    deleteAllTeams,
    deleteTeam,
    getAllChannels,
    getChannel,
    createChannel,
    editAllChannels,
    editChannel,
    deleteAllChannels,
    deleteChannel,
    getAllStatuses,
    getStatus,
    createStatus,
    editAllStatuses,
    editStatus,
    deleteAllStatuses,
    deleteStatus,
    getAllTypes,
    getType,
    createType,
    editAllTypes,
    editType,
    deleteAllTypes,
    deleteType,
    getAllClasses,
    getClass,
    createClass,
    editAllClasses,
    editClass,
    deleteAllClasses,
    deleteClass,
    getAllStands,
    getStand,
    createStand,
    editAllStands,
    editStand,
    deleteAllStands,
    deleteStand,
    getAllStoragelocations,
    getStoragelocation,
    createStoragelocation,
    editAllStoragelocations,
    editStoragelocation,
    deleteAllStoragelocations,
    deleteStoragelocation,
    getAllUsers,
    getUser,
    createUser,
    editAllUsers,
    editUser,
    deleteAllUsers,
    deleteUser,
    getAllHelpers,
    getHelper,
    createHelper,
    editAllHelpers,
    editHelper,
    deleteAllHelpers,
    deleteHelper,
    changeHelperStatus,
    getAllTeachers,
    getTeacher,
    createTeacher,
    editAllTeachers,
    editTeacher,
    deleteAllTeachers,
    deleteTeacher,
    getAllAssignments,
    getAssignment,
    createAssignment,
    editAllAssignments,
    editAssignment,
    deleteAllAssignments,
    deleteAssignment,
    getAllWalkietalkies,
    getWalkietalkie,
    createWalkietalkie,
    editAllWalkietalkies,
    editWalkietalkie,
    deleteAllWalkietalkies,
    deleteWalkietalkie,
    changeWalkietalkieStatus,
    getAllClassrepresentatives,
    getClassrepresentative,
    createClassrepresentative,
    editAllClassrepresentatives,
    editClassrepresentative,
    deleteAllClassrepresentatives,
    deleteClassrepresentative,
    getAllMaterials,
    getMaterial,
    createMaterial,
    editAllMaterials,
    editMaterial,
    deleteAllMaterials,
    deleteMaterial
}