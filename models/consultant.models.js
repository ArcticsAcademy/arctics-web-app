const mongoose = require('mongoose')

const { MediaSchema } = require('./system.models')


// Consultant schema & sub-schemas.
const ConsultantTransactionSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    content: { type: String, required: true },
    amount: { type: Number, required: true },
    balance: { type: Number, required: true },
    withdrawn: { type: Number, required: true }
}, { _id: false })

const ConsultantNotificationSchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String },
    read: { type: Boolean, required: true, default: false }
}, {_id: false })

const ConsultantAnnouncementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    read: { type: Boolean, required: true, default: false }
}, { _id: false })

const ConsultantMeetingSchema = new mongoose.Schema({
    id: { type: String, required: true },
    status: { type: String, required: true, default: "future" },
    startTimestamp: { type: Date, required: true },
    studentName: { type: String, required: true },
    studentYear: { type: String, required: true },
    studentItems: { type: [String], required: true, default: [] },
    remark: { type: String, required: true, default: "" },
    comment: { type: String, required: true, default: "" }
}, { _id: false })

const ConsultantBankSchema = new mongoose.Schema({
    default: { type: Boolean, required: true, default: false },
    usage: { type: String },
    bankNo: { type: String, required: true },
    accountNo: { type: String, required: true }
}, { _id: false })

const ConsultantSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true, select: true, unique: true },
    user: {
        email: { type: String, required: true }, // Email
        passwordEncrypted: { type: String, required: true },
        passwordSalt: { type: String, required: true },
        otpEmail: { type: String },
        otpMobile: { type: String}
    },
    profile: {
        // 基本資料-上
        photo: { type: MediaSchema },
        surname: { type: String, required: true }, // 名字
        name: { type: String, required: true }, // 名字
        count: { type: Number, required: true, default: 0 }, // 已諮詢
        star: { type: Number }, // 星星

        // 基本資料
        price: { type: Number, required: true, default: 200 }, // 費用
        school: { type: String, required: true }, // 就讀&畢業
        major: { type: String }, // 就讀&畢業
        year: { type: String, required: true }, // 就讀&畢業
        field: { type: [String], required: true, default: [] }, // 學群
        labels: { type: [String], required: true, default: [] }, // 諮詢項目
        experiences: { type: String }, // 相關經歷&能力證明
        intro: { type: String }, // 個人簡介

        // 帳戶設定 (密碼不傳)
        email: { type: String, required: true }, // 電子信箱
        emailBackup: { type: String }, // 備援信箱
        mobile: { type: String, required: true }, // 手機號碼
        mobileBackup: { type: String }, // 備援號碼

        // 時間表
        timetable: { type: [[Number], [Number], [Number], [Number], [Number], [Number], [Number]], required: true, default: [[], [], [], [], [], [], []] },

        // 修改才出現的項目
        minor: { type: String }, // 雙主修&輔修
        emailVerified: { type: Boolean, required: true, default: false }, // 驗證信箱
        mobileVerified: { type: Boolean, required: true, default: false }, // 驗證號碼
        studentCard: { type: MediaSchema }, // 上傳學生證
        studentCardVerified: { type: Boolean, required: true, default: false }, // 上傳學生證
    },
    purse: {
        balance: { type: Number, required: true, default: 0 },
        withdrawn: { type: Number, required: true, default: 0 },
        transactions: { type: [ConsultantTransactionSchema], required: true , default: [] },
        bankList: { type: [ConsultantBankSchema], required: true, default: [] }
    },
    meetings: { 
        future: { type: [ConsultantMeetingSchema], required: true, default: [] },
        past: { type: [ConsultantMeetingSchema], required: true, default: [] },
        cancelled: { type: [ConsultantMeetingSchema], required: true, default: [] }

    },
    announcements: {
        unreadCount: { type: Number, required: true, default: 0 },
        list: { type: [ConsultantAnnouncementSchema], required: true, default: [] }
    },
    notifications: {
        unreadCount: { type: Number, required: true, default: 0 },
        list: { type: [ConsultantNotificationSchema], required: true, default: [] }
    }
}, { id: false, collection: "Consultants" })
const ConsultantModel = mongoose.model('Consultant', ConsultantSchema)


module.exports = { ConsultantModel }