// Models
const { ConsultantModel } = require('../models/consultant.models')
const { MeetingModel } = require('../models/meeting.models')
const { AnnouncementModel } = require('../models/system.models')

// Utils
const timeUtil = require('../utils/time.utils')


const getConsultantDashboard = async function(id) {
    let dashboard = await ConsultantModel.findOne({ id: id }).select('profile announcements meetings purse')
    return dashboard
}

const getConsultantProfile = async function(id) {
    let profile = await ConsultantModel.findOne({ id: id }).select('profile')
    return profile
}

const getConsultantPurse = async function(id) {
    let purse = await ConsultantModel.findOne({ id: id }).select('purse')
    return purse
}

const getConsultantMeetingsCalendar = async function(id, date) {
    // load meetings
    let meeting = await ConsultantModel.findOne({ id: id }).select('meetings')
    
    // filter settings
    year = date.getFullYear()
    month = date.getMonth()
    let start = timeUtil.yearMonthToDatetimeRange(timeUtil.previousMonth(year, month))[0]
    let end = timeUtil.yearMonthToDatetimeRange(timeUtil.nextMonth(year, month))[1]
    
    // filter all
    meeting.future = meeting.future.filter(meeting => (start < meeting.timestamp < end))
    meeting.past = meeting.past.filter(meeting => (start < meeting.timestamp < end))
    meeting.canceled = meeting.canceled.filter(meeting => (start < meeting.timestamp < end))
    
    return meeting
}

const getConsultantMeetingsList = async function(id) {
    let meeting = await ConsultantModel.findOne({ id: id }).select('meetings')
    return meeting
}

const getConsultantNotifications = async function(id) {
    // load data
    let notifs = await ConsultantModel.findOne({ id: id }).select('announcements notifications')

    // replace announcements
    for (item in notifs.announcements) {
        let temp = await AnnouncementModel.findOne({ id: item.id })
        item = Object.assign(item, temp)
    }
    return notifs
}

const consultantCancelMeeting = async function(consultantId, meetingId) {
    try {
        // Consultant Side
        // a. Move meeting
        let startTimestamp
        let consultant = await ConsultantModel.findOne({ id: consultantId })
        for (let i = 0; i < consultant.future.size(); i++) {
            if (consultant.future[i].id === meetingId) {
                startTimestamp = consultant.future[i].startTimestamp
                consultant.canceled.push(consultant.future[i])
                delete consultant.future[i]
                break
            }
        }
        consultant.canceled.sort(_compareMeeting)
        // b. Add notification
        consultant.notifications.push({
            id: consultant.notifications.size(),
            timestamp: new Date(),
            title: `您在${timeUtil.timestampToString(startTimestamp)}的諮詢已經取消，請前往「我的諮詢」查看！`,
            content: null,
            read: false
        })
        // 0. Save
        await consultant.save()

        // Meeting Side
        // a. Write record
        let meeting = await MeetingModel.findOne({ id: meetingId })
        meeting.records.push({ timestamp: new Date(), description: "consultant canceled meeting" })
        // 0. Save
        await meeting.save()
        
        // Student Side
        // ...
        
        // some other stuff, like push notifications et al.
        return true
    }
    catch (e) {
        console.error(e)
        return false
    }
}


// Util Functions
const _compareMeeting = function(meeting1, meeting2) {
    if (meeting1.startTimestamp < meeting2.startTimestamp) return -1
    else if (meeting1.startTimestamp > meeting2.startTimestamp) return 1
    else return 0
}


// Exports
module.exports = 
{ 
    getConsultantDashboard,
    getConsultantProfile, 
    getConsultantPurse,
    getConsultantMeetingsCalendar,
    getConsultantMeetingsList,
    getConsultantNotifications,

    consultantCancelMeeting
}