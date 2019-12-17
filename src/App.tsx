import React, { useState } from 'react';
import { TextField, Box, Button } from '@material-ui/core';
import './App.css';

import DataProvider from './DataProvider';
import SchemaView from './SchemaView';
import { TableSchema } from './model/model';

const provider = new DataProvider();

const filterData: (schema: TableSchema[]) => TableSchema[] = (schemas: TableSchema[]) => {
    // const jsonConvert: (it: TableField) => object = (item: TableField) => {
    //     const obj: any = {
    //         type: item.type
    //     };
    //     if (item.targetClass) {
    //         obj.targetClass = item.targetClass;
    //     }

    //     if (item.required) {
    //         obj.required = item.required;
    //     }

    //     return obj;
    // };

    const data = schemas.map(({ className, fields: {
        objectId,
        createdAt,
        updatedAt,
        ACL,
        ...props
    }, classLevelPermissions }) => {
        let field = {};
        if (['_User', '_Installation', '_Session', '_Role'].includes(className)) {
            // remove common field
            if (className === '_User') {
                const { emailVerified, authData, username, password, email, ...remain } = props;
                field = { ...remain };
            }
            if (className === '_Installation') {
                const { installationId, deviceToken, channels, deviceType, pushType, GCMSenderId, timeZone, localeIdentifier, badge, appVersion, appName, appIdentifier, parseVersion, ...remain } = props;
                field = { ...remain };
            }
            if (className === '_Session') {

            }
        } else {
            field = { ...props };
        }

        const obj: TableSchema = {
            className,
            fields: { ...field },
            classLevelPermissions
        };
        return obj;
    }
    );

    // console.log(data);

    return data;
};

const App: React.FC = () => {
    // source
    const [url, setUrl] = useState(process.env.REACT_APP_SOURCE_URL || '');
    const [masterKey, setMasterKey] = useState(process.env.REACT_APP_MASTER_KEY || '');
    const [appId, setAppId] = useState(process.env.REACT_APP_SOURCE_APP_ID || '');

    // target
    const [targetUrl, setTargetUrl] = useState(process.env.REACT_APP_TARGET_SOURCE_URL || '');
    const [targetMasterKey, setTargetMasterKey] = useState(process.env.REACT_APP_TARGET_MASTER_KEY || '');
    const [targetAppId, setTargetAppId] = useState(process.env.REACT_APP_TARGET_SOURCE_APP_ID || '');

    // source schema
    const [schemas, setSchemas] = useState<TableSchema[]>([]);

    const cleanData = async () => {
        const data = await provider.fetchSchema(url, {
            'X-Parse-Application-Id': appId,
            'X-Parse-Master-Key': masterKey,
            'Content-Type': 'application/json'
        });
        // do import
        await provider.clearData(targetUrl, {
            'X-Parse-Application-Id': targetAppId,
            'X-Parse-Master-Key': targetMasterKey,
            'Content-Type': 'application/json'
        }, data);
    };

    return (
        <Box display="flex" width="100%" flexDirection="column">
            {/* box server info */}
            <Box flexDirection="row" display="flex" p={2} width={1} justifyContent="center" alignItems="center">
                <Box width={1} p={1}>
                    <TextField fullWidth label="Url" value={url} onChange={e => setUrl(e.target.value)} />
                </Box>

                <Box width={1} p={1}>
                    <TextField fullWidth label="App id" value={appId} onChange={e => setAppId(e.target.value)} />
                </Box>

                <Box width={1} p={1}>
                    <TextField fullWidth label="master key" value={masterKey} onChange={e => setMasterKey(e.target.value)} />
                </Box>
            </Box>
            <Box flexDirection="row" display="flex" p={2} width="100%" justifyContent="center" alignItems="center">
                <Box p={1}>
                    <Button variant="outlined" onClick={async () => {
                        const data = await provider.fetchSchema(url, {
                            'X-Parse-Application-Id': appId,
                            'X-Parse-Master-Key': masterKey,
                            'Content-Type': 'application/json'
                        });
                        console.log(data);
                        setSchemas(data);
                    }}>Load Schema</Button>
                </Box>
                <Box p={1}>
                    <Button variant="outlined" disabled={!schemas || schemas.length === 0} onClick={() => { }}>Export</Button>
                </Box>
            </Box>

            <Box flexDirection="row" display="flex" p={2} width={1} justifyContent="center" alignItems="center">
                <Box width={1} p={1}>
                    <TextField fullWidth label="Url" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} />
                </Box>

                <Box width={1} p={1}>
                    <TextField fullWidth label="Target app id" value={targetAppId} onChange={e => setTargetAppId(e.target.value)} />
                </Box>

                <Box width={1} p={1}>
                    <TextField fullWidth label="Target master key" value={targetMasterKey} onChange={e => setTargetMasterKey(e.target.value)} />
                </Box>
            </Box>
            <Box width={1} justifyContent="center" display='flex'>
                <Box p={1}>
                    <Button variant="outlined" disabled={!url || !targetUrl || !appId || !masterKey || !targetAppId || !targetMasterKey} onClick={async () => {
                        // do export and then import into target server
                        const data = await provider.fetchSchema(url, {
                            'X-Parse-Application-Id': appId,
                            'X-Parse-Master-Key': masterKey,
                            'Content-Type': 'application/json'
                        });
                        await cleanData();
                        // do import
                        await provider.importSchema(targetUrl, {
                            'X-Parse-Application-Id': targetAppId,
                            'X-Parse-Master-Key': targetMasterKey,
                            'Content-Type': 'application/json'
                        }, filterData(data), false, {
                            url: url,
                            headers: {
                                'X-Parse-Application-Id': appId,
                                'X-Parse-Master-Key': masterKey,
                                'Content-Type': 'application/json'
                            }
                        });
                    }}>Transfer</Button>
                </Box>
                <Box p={1}>
                    <Button variant="outlined" disabled={!targetUrl || !targetAppId || !targetMasterKey}>Import</Button>
                </Box>
                <Box p={1}>
                    <Button variant="outlined" disabled={!targetUrl || !targetAppId || !targetMasterKey} onClick={async () => {
                        // get schemas
                        await cleanData();
                    }}>Reset</Button>
                </Box>
            </Box>

            {/* display data info */}
            <Box flexDirection="column" display="flex" p={2} width="100%" justifyContent="center" alignItems="center" >
                {
                    schemas && schemas.map((schema, index) => (<SchemaView key={index} {...schema} />))
                }
            </Box>
        </Box>
    );
}

export default App;
