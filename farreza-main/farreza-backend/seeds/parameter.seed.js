let Model = require("../models/Parameter");
const defaultModels = [
    { title: "Frais Livraison", key: "shipping", value: 0 },
    { title: "Frais Plateforme (%)", key: "percentage", value: 0 },
]
const condition = process.env.SEED_PARAMS
if (condition && condition == "true") {
    console.log("*** SEED INIT PARAMS ***");
    defaultModels.forEach(defaultModel => {
        console.log(`Searching param : ${defaultModel.key} ...`)
        Model.findOne({ key: defaultModel.key })
            .then((param) => {
                if (!param) {
                    console.log(`Creating ... key: ${defaultModel.key}`)
                    new Model(defaultModel).save()
                        .then(() => console.log(`Param : ${param.key} Added Successfully`))
                        .catch((err) => console.error());
                } else {
                    console.log(`Param: ${defaultModel.key}, found`)
                }
            })
    });
}