/*
 * Programmer: Cemisis/Elonat
 * Version: Alpha 0.1
 * Project: Sofeo API
*/
function isNull(varToCheck, checkZero){
    if(checkZero == false){
        if(varToCheck == null || varToCheck == ""){
            return true;    
        }else{
            return false;
        }
    }else{
        if(varToCheck == null || varToCheck == "" || varToCheck == 0){
            return true;
        }else{
            return false;
        }
    }
}

const { request, response } = require('express'); // ?
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
    pool.query('SELECT area_id FROM area ORDER BY area_id DESC', (error, results) => {
        if(error){
            throw error
        }
        id = results.rows[0].area_id;
    })

    const query = 'INSERT INTO area (area_id, name) VALUES ? RETURNING *';
    pool.query(query, [id, name], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Created Area with id $1 and name $2', [id, name]);
    })
}

const editAllAreas = (request, response) => {
    const { name } = request.body;
    let values = new Array();
    pool.query('SELECT area_id FROM area ORDER BY area_id ASC', (error, results) => {
        if(error){
            throw error
        }
        for (let index = 0; index < results.rows.length; index++) {
            const element = results.rows[index].area_id;
            values[index] = new Array(element, name);
        }
    })

    pool.query('INSERT INTO area (area_id, name) VALUES ? RETURNING *', values, (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Changed name of all areas to $1', [name])
    })
}

const editArea = (request, response) => {
    const id = request.params.areaId;
    const { name } = request.body;
    pool.query('INSERT INTO area (area_id, name) VALUES ? RETURNING *', [id, name], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Changed name of area with id $1 to $2', [id, name]);
    })
}

const deleteAllAreas = (request, response) => {
    pool.query('DELETE FROM area RETURNING *', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Deleted all areas')
    })
}

const deleteArea = (request, response) => {
    const id = request.params.areaId;
    pool.query('DELETE FROM area WHERE area_id = $1 RETURNING *', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Deleted area with id $1', [id])
    })
}

const getAllGenders = (request, response) => {
    pool.query('SELECT * FROM gender ORDER BY gender_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })    
}

const getGender = (request, response) => {
    const id = request.params.genderId;
    pool.query('SELECT * FROM gender WHERE gender_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createGender = (request, response) => {
    const { name } = request.body;
    let id = 0;
    pool.query('SELECT gender_id FROM gender ORDER BY gender_id DESC', (error, results) => {
        if(error){
            throw error
        }
        id = results.rows[0].gender_id;
    })

    const query = 'INSERT INTO gender (gender_id, name) VALUES ? RETURNING *';
    pool.query(query, [id, name], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Created Gender with id $1 and name $2', [id, name]);
    })
}

const editAllGenders = (request, response) => {
    const { name } = request.body;
    let values = new Array();
    pool.query('SELECT gender_id FROM gender ORDER BY gender_id ASC', (error, results) => {
        if(error){
            throw error
        }
        for (let index = 0; index < results.rows.length; index++) {
            const element = results.rows[index].gender_id;
            values[index] = new Array(element, name);
        }
    })

    pool.query('INSERT INTO gender (gender_id, name) VALUES ? RETURNING *', values, (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Changed name of all genders to $1', [name])
    })
}

const editGender = (request, response) => {
    const id = request.params.genderId;
    const { name } = request.body;
    pool.query('INSERT INTO gender (gender_id, name) VALUES ? RETURNING *', [id, name], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Changed name of gender with id $1 to $2', [id, name]);
    })
}

const deleteAllGenders = (request, response) => {
    pool.query('DELETE FROM gender RETURNING *', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Deleted all genders')
    })
}

const deleteGender = (request, response) => {
    const id = request.params.genderId;
    pool.query('DELETE FROM gender WHERE gender_id = $1 RETURNING *', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send('Deleted gender with id $1', [id])
    })
}

const getAllTeams = (request, response) => {
    pool.query('SELECT * FROM team ORDER BY team_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getTeam = (request, response) => {
    const id = request.params.teamId;
    pool.query('SELECT * FROM team WHERE team_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows);
    })
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
    pool.query('SELECT * FROM channel ORDER BY channel_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    }) 
}

const getChannel = (request, response) => {
    const id = request.params.channelId;
    pool.query('SELECT * FROM channel WHERE channel_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM status ORDER BY status_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    }) 
}

const getStatus = (request, response) => {
    const id = request.params.statusId
    pool.query('SELECT * FROM status WHERE status_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM type ORDER BY type_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    }) 
}

const getType = (request, response) => {
    const id = request.params.typeId
    pool.query('SELECT * FROM type WHERE type_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM class ORDER BY class,grade ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })    
}

const getClass = (request, response) => {
    const values = new Array(request.params.classId, request.params.grade);
    pool.query('SELECT * FROM class WHERE class = $1 AND grade ? $2', values, (error, results) => {
        if(error){
            throw error
        } 
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM stand ORDER BY stand_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })    
}

const getStand = (request, response) => {
    const id = request.params.standId 
    pool.query('SELECT * FROM stand WHERE stand_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM storagelocation ORDER BY sl_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getStoragelocation = (request, response) => {
    const id = request.params.storagelocationId
    pool.query('SELECT * FROM storagelocation WHERE sl_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT user_id, loginname, area_id FROM users ORDER BY user_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUser = (request, response) => {
    const id = request.params.userId
    pool.query('SELECT user_id, loginname, area_id FROM users WHERE user_id LIKE $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM helper ORDER BY helper_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getHelper = (request, response) => {
    const id = request.params.helperId
    pool.query('SELECT * FROM helper WHERE helper_id LIKE $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM teacher ORDER BY abbreviation ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getTeacher = (request, response) => {
    const id = request.params.teacherId
    pool.query('SELECT * FROM teacher WHERE abbreviation LIKE $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM assignment ORDER BY assignment_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getAssignment = (request, response) => {
    const id = request.params.assignmentId
    pool.query('SELECT * FROM assignment WHERE assignment_id = $1', [id], (error, results) => {
        if(error){
            throw(error)
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM walkietalkie ORDER BY wt_id ASC', (error, result) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getWalkietalkie = (request, response) => {
    const id = request.params.walkietalkieId
    pool.query('SELECT * FROM walkietalkie WHERE wt_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM classrepresentative ORDER BY classrep_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getClassrepresentative = (request, response) => {
    const id = request.params.classrepresentativeId
    pool.query('SELECT * FROM classrepresentative WHERE classrep_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    pool.query('SELECT * FROM material ORDER BY material_id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getMaterial = (request, response) => {
    const id = request.params.materialId
    pool.query('SELECT * FROM material WHERE material_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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

const getAllClassMaterials = (request, response) => {
    pool.query('SELECT * FROM classrep_material ORDER BY id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getClassMaterial = (request, response) => {
    const id = request.params.materialId
    pool.query('SELECT * FROM classrep_material WHERE id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

//id (false), classrep_id (false), material_id (false)

const createClassMaterial = (request, response) => {

}

const editClassMaterial = (request, response) => {

}

const editClassMaterialId = (request, response) => {

}

const deleteClassMaterial = (request, response) => {

}

const deleteClassMaterialId = (request, response) => {

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
