const {EN, VI} = require('./constants');

module.exports = {
    DATABASE_CONNECT_ERROR: {
        [EN]: {code: 503, message: 'Database connection error'},
        [VI]: {code: 503, message: 'Lỗi kết nối database'}
    },
    BAD_REQUEST:{
        [EN]: {code: 400, message: 'Bad request'},
        [VI]: {code: 400, message: 'Dữ liệu không hợp lệ'}
    },
    SYSTEM_ERROR:{
        [EN]: {code: 500, message: 'System error'},
        [VI]: {code: 500, message: 'Lỗi hệ thống'}
    },
    SUCCESS:{
        [EN]: {code: 200, message: 'Successful'},
        [VI]: {code: 200, message: 'Thành công'}
    },
    ACCESS_DENIED:{
        [EN]: {code: 403, message: 'Access Denied'},
        [VI]: {code: 403, message: 'Ban khong co quyen truy cap vao tai nguyen nay!'}
    }
}