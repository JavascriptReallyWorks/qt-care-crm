const encrypt = require('mongoose-encryption');

module.exports = app => {
    class MigrationService extends app.Service {
        migrateMedicalRecord() {
            const { ctx } = this;
            const encKey = app.config.encryptionKey;
            const sigKey = app.config.signingKey;
            let schema = ctx.model.MedicalRecord.schema;
            schema.plugin(encrypt.migrations, {
                encryptionKey: encKey,
                signingKey: sigKey,
                excludeFromEncryption: [
                    'openid',
                    'userid',
                    'driver_id',
                    'pre_activation_collection_status',
                    'driver_status',
                    'wx_unionid',
                    'wx_openid',
                    'wx_name',
                    'gov_id',
                    'patientName',
                    'createTime',
                    'updateTime',
                    'presentDiagnosis',
                    'patientBirthday'
                ]
            });
            let MedicalRecord = app.mongoose.model('MedicalRecord', schema, 'medical_record');
            MedicalRecord.migrateToA(function(err) {
                if (err) { throw err; }
                console.log('Migration successful');
            });
        };
    }
    return MigrationService;
};