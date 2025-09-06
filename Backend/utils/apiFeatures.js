class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
        // queryStr - [Object: null prototype] { keyword: 'Samsung' }
        // query - which gives the object of the product as a query
    }

    search(){
        let keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                $options : 'i'
            }
        } : {};

        this.query.find({...keyword});
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach((field) => delete queryStrCopy[field]);

        const mongoQuery = {};
        
        for (const key in queryStrCopy) {
            // Handle price range (price[gte]=100&price[lte]=1000)
            if (key.includes('[') && key.includes(']')) {
                const [field, operator] = key.replace(']', '').split('[');
                if (!mongoQuery[field]) mongoQuery[field] = {};
                mongoQuery[field][`$${operator}`] = parseFloat(queryStrCopy[key]);
            }
            // Handle category and other simple fields
            else {
                mongoQuery[key] = isNaN(queryStrCopy[key]) 
                    ? queryStrCopy[key] 
                    : parseFloat(queryStrCopy[key]);
            }
        }

        this.query = this.query.find(mongoQuery);
        return this;
    }
    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        
        // console.log(`Paginating: page=${currentPage}, skip=${skip}, limit=${resPerPage}`);
        
        this.query = this.query.skip(skip).limit(resPerPage);
        return this;
    }
}

module.exports = ApiFeatures