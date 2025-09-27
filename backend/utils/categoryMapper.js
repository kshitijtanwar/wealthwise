const categoryKeywords = {

    Food : ["restaurant","cafe","coffee","pizza","burger"],

    Transport: ["uber","taxi","tarin","bus","metro"],

    Shopping: ["amazon","mall","fashion","clothes","electronics"],

    Utilities: ["electricity","water","gas","internet","phone"]

};


 

function mapCategory(description,merchant){

    for(const [category,keywords] of Object.entries(categoryKeywords)){

        for(const keyword of keywords){

            if (

                description?.toLowerCase().includes(keyword) ||

                merchant?.toLowerCase().includes(keyword)

            ) {

                return category;

            }

        }

    }

    return "Other";

}
 

module.exports = mapCategory;