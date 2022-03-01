const { ConsultantModel } = require('../models/consultant.models')

const systemValidateConsultantStudentCard = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id })
    consultant.profile.studentCardVerified = true
    await consultant.save()
}

const getConsultantObject = async (id) => {
    let consultant = await ConsultantModel.findOne({ id: id })
    delete consultant.user
    return consultant
}

module.exports = { systemValidateConsultantStudentCard, getConsultantObject }