const { tblcountry, tblregions, tbladdresstype } = require('../models')
const countryData = {}
const regionsData = {}
const addressTypeData = {}

countryData.isCountryExists = async (req, res, next) => {
    try {
        const { country } = req.body.address
        let _country = country.toUpperCase()
        const countryExist = await tblcountry.findOne({ where: { country_iso_code: _country } })
        if (!countryExist) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid Country ISO Code!',
                data: null,
                error: error.message,
                purpose: 'Requset data validation error!'
            })
        } else {
            req.country_id = countryExist.id
            next()
        }
        
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Country Data not found!',
            data: null,
            error: error.message,
            purpose: 'Requset data validation error!'
        })
    }
}


regionsData.isRegiionsExists = async (req, res, next) => {
    try {
        const { region } = req.body.address
        let _region = region.toLowerCase().replace(/\b[a-z]/g, (x) => x.toUpperCase())
        const regionsExist = await tblregions.findOne({ where: { region_name: _region } })
        if (!regionsExist) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid region name!',
                data: null,
                error: error.message,
                purpose: 'Requset data validation error!'
            })
        } else {
            req.region_id = regionsExist.id
            next()
        }
        
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Region Data not found!',
            data: null,
            error: error.message,
            purpose: 'Requset data validation error!'
        })
    }
}


addressTypeData.isAddressTypeExists = async (req, res, next) => {
    try {
        const { address_type } = req.body.address
        let _type = address_type.replace(/\b[a-z]/g, (x) => x.toUpperCase())
        const addressTypeExist = await tbladdresstype.findOne({ where: { type: _type } })
        if (!addressTypeExist) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid address type!',
                data: null,
                error: error.message,
                purpose: 'Requset data validation error!'
            })
        } else {
            req.addressType_id = addressTypeExist.id 
            next()
        }
        
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Address Type Data not found!',
            data: null,
            error: error.message,
            purpose: 'Requset data validation error!'
        })
    }
}

module.exports = {
    countryData,
    regionsData,
    addressTypeData
}