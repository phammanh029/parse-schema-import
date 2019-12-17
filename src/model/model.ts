type ReverseName = "objectId" | "createdAt" | "updatedAt" | "ACL";
// type fieldType = string extends ReverseName ? never : string;

export interface TableField {
    type: string;
    targetClass?: string;
    required?: boolean;
    defaultValue?: any;
}


export interface TableSchemaField {
    [key: string]: TableField;
}

export interface OperationPermission {
    [key: string]: boolean | Array<string>;
}

export interface SchemaClassPermission {

    [key: string]: OperationPermission;
    // "find": {
    //     "*": true
    // },
    // "count": {
    //     "*": true
    // },
    // "get": {
    //     "*": true
    // },
    // "create": {
    //     "*": true
    // },
    // "update": {
    //     "*": true
    // },
    // "delete": {
    //     "*": true
    // },
    // "addField": {},
    // "protectedFields": {}
}

export interface TableSchema {
    className: string;
    fields: TableSchemaField;
    classLevelPermissions: SchemaClassPermission;
}