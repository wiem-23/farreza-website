let UserModel = require("../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const { ADMIN } = require("../constants/roles.constant");
const defaultUserModels = [
    {
        email: "yassine.elouni.dev@gmail.com",
        password: "azerty123",
        role: ADMIN,
        account: {
            username: "sinouw",
            phone: "+216 52 940 748",
            avatar: {
                url:
                    "https://image.noelshack.com/fichiers/2020/47/2/1605630068-avatar-05d357e6.png",
            },
        }
    },
    {
        email: "bilellester@gmail.com",
        password: "azerty123",
        role: ADMIN,
        account: {
            username: "bilellester",
            phone: "+216 50 085 098",
            avatar: {
                url:
                    "https://image.noelshack.com/fichiers/2020/47/2/1605630068-avatar-05d357e6.png",
            },
        }
    },
    {
        email: "rifigharbikhadija@gmail.com",
        password: "azerty123",
        role: ADMIN,
        account: {
            username: "khadija",
            phone: "+216 52 940 748",
            avatar: {
                url:
                    "https://image.noelshack.com/fichiers/2020/47/2/1605630068-avatar-05d357e6.png",
            },
        }
    }
]
const condition = process.env.SEED_USERS
if (condition && condition == "true") {
    console.log("*** SEED INIT USERS ***");
    defaultUserModels.forEach(defaultUserModel => {
        console.log(`Searching user : ${defaultUserModel.email} ...`)
        const salt = uid2(16);
        const hash = SHA256(defaultUserModel.password + salt).toString(encBase64);
        const token = uid2(16);

        UserModel
            .findOne({
                email: defaultUserModel.email,
            })
            .then((user) => {
                if (!user) {
                    console.log(`Creating ... email: ${defaultUserModel.email}`)
                    new UserModel({ ...defaultUserModel, token, hash, salt }).save()
                        .then(() => console.log(`user : ${user.email} Added Successfully`))
                        .catch((err) => console.error());
                } else {
                    console.log(`User: ${defaultUserModel.email}, found`)
                }
            })
    });
}