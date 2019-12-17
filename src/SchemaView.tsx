import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Switch } from '@material-ui/core';

function getValue(permission: import('./model/model').OperationPermission, key: string): boolean | string {
    if (Array.isArray(permission)) {
        return (permission || []).join(', ');;
    }

    return !!permission[key];
}

const SchemaView: React.FC<import('./model/model').TableSchema> = ({ className, classLevelPermissions, fields }) => {
    return (
        <Box width="100%" p={1}>
            <Box display="flex" width="100%" flexDirection="row" p={1}>
                <Box p={1}><Typography variant="h3">{className}</Typography></Box>
                <Box p={1} display="flex">
                    {Object.keys(classLevelPermissions).map((key, index) => (<Box key={index} flexDirection="column" p={1}>
                        <Box p={1}>{key}</Box>
                        <Box p={1}>{
                            (() => Array.isArray(classLevelPermissions[key]) ? (<div>{getValue(classLevelPermissions[key], '*')} </div>) : (
                                <Switch value={key} checked={!!classLevelPermissions[key]['*']} />))()}
                        </Box>
                    </Box>))}
                </Box>
            </Box>
            <Box p={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Field name</TableCell>
                            <TableCell>Field Type</TableCell>
                            <TableCell>Target</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(fields).map((key, index) => (<TableRow key={index}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{fields[key].type}</TableCell>
                            <TableCell>{fields[key].targetClass}</TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default SchemaView;