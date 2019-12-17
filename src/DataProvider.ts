import 'axios';
import Axios from 'axios';
import './model/model';
import { TableSchema } from './model/model';

interface ApiResponse {
    results: TableSchema[];
}

interface GetDataResponse {
    results: {
        objectId: string;
        [key: string]: any;
    }[];
}

interface SourceInfo {
    headers: any;
    url: string;
}

interface CreateApiResponse {
    objectId: string;
}

interface DataMapping {
    [key: string]: {
        [key: string]: any;
    }
}

class DataProvider {
    async fetchSchema(url: string, headers: any): Promise<TableSchema[]> {
        // return 
        const data = await Axios.get<ApiResponse>(url + '/schemas', {
            headers: headers
        });
        // console.log(data);
        return data.data.results;
    }

    async handleParseObject(dataMapping: DataMapping, data: any){
        if(data.__type === 'Pointer'){
            // check if exist
            if(dataMapping[data['objectId']]){
                return dataMapping[data['objectId']];
            }
        }
    }

    async insertData(url: string, headers: any, className: string, body: any, dataMapping: DataMapping): Promise<CreateApiResponse> {
        const keys = Object.keys(body).filter((key) => this.isParseObject(body[key]));
        for (const key of keys) {
            // do insert data with key
            // if(!dataMapping[key])
        }
        const result = await Axios.post<CreateApiResponse>(`${url}/classes/${className}`, body, {
            headers: headers
        });

        return result.data;
    }

    // check if is parse object
    isParseObject(data: any): boolean {
        if (data && typeof data === 'object' && data.className) {
            return true;
        }

        return false;
    }

    async importSchema(url: string, headers: any, schemas: TableSchema[], importData: boolean = false, sourceInfo?: SourceInfo): Promise<any> {
        const mapData: DataMapping = {

        };
        const data = await Promise.all(schemas.map(async schema => {
            if (['_User', '_Installation', '_Session', '_Role'].includes(schema.className)) {
                return await Axios.put(`${url}/schemas/${schema.className}`, schema, {
                    headers: headers
                });
            }
            const res = await Axios.post(`${url}/schemas/${schema.className}`, schema, {
                headers: headers
            });

            if (importData && sourceInfo) {
                mapData[schema.className] = {

                };
                // get data
                const response = await Axios.get<GetDataResponse>(`${sourceInfo.url}/classes/${schema.className}`, {
                    headers: sourceInfo.headers
                });
                if (response.status === 200) {
                    // process insert data
                    for (const body of response.data.results.map(({ createdAt, updatedAt, objectId, ...props }) => ({ ...props }))) {
                        // transform body
                        const keys = Object.keys(body);
                        for (const key of keys) {
                            if (body[key] && typeof body[key] === 'object') {
                                // check if is relation
                                if (body[key].className) {
                                    // pointer or relation
                                    if (body[key].__type) {
                                        if (body[key].__type === 'Relation') {
                                            // get relation and do add
                                            // query relation
                                        }
                                    }
                                }

                            }
                        }

                        // send request
                        // const addResult = await Axios.post<CreateApiResponse>(`${url}/classes/${schema.className}`, body, {
                        //     headers: headers
                        // });

                        // if (addResult.status === 200) {
                        //     mapData[schema.className].objectId = addResult.data.objectId;
                        // }
                    }
                }
            }

            return res;
        }));

        console.log(data);
    }

    async clearData(url: string, headers: any, schemas: TableSchema[]): Promise<any> {
        // const path = url.substr(url.lastIndexOf('/'));
        await Promise.all(schemas.map(async (schema) => {
            // get data
            let res = await Axios.get<GetDataResponse>(`${url}/classes/${schema.className}`, {
                headers: headers
            });
            while (res.status === 200 && res.data.results.length > 0) {
                const ids = res.data.results.map((item) => item.objectId);
                for (const id of ids) {
                    await Axios.delete(`${url}/classes/${schema.className}/${id}`, {
                        headers: headers
                    });
                }
                // await Axios.post(`${url}/batch`, {
                //     requests: ids.map((id) => ({
                //         method: "DELETE",
                //         path: `${path}/classes/${schema.className}/${id}`
                //     }), {
                //         headers: headers
                //     })
                // });
                res = await Axios.get<GetDataResponse>(`${url}/classes/${schema.className}`, {
                    headers: headers
                });
            }
            const rs = await Axios.delete(`${url}/schemas/${schema.className}`, {
                headers: headers
            });
            return rs;
        }));

        // console.log(data);
        // create default class
        for (const className of ['_User', '_Installation', '_Session', '_Role']) {
            // recreate default 
            try {
                await Axios.post(`${url}/schemas/${className}`, {
                    className: className
                }, {
                    headers: headers
                });
            } catch (err) {
                console.error(err);
            }
        }
    }
}

export default DataProvider;