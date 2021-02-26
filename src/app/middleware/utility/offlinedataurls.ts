export const clientAPIS: APISqlite[] = [
    { api: 'regions/', table: 'Regions', columns: ['Id', 'Name', 'Description'], type: 'GET', upsert: '' },
    { api: 'fmzs/', table: 'FMZ', columns: ['Id', 'Name', 'FacilityManager', 'Description', 'RegionId'], type: 'GET', upsert: '' },
    { api: 'userdefinedtemplates/', table: 'UserDefinedTemplate', columns: ['ClientId', 'Id', 'BuildingItemTypeCode', 'Name'], type: 'GET', upsert: '' },
    { api: 'lookups/', table: 'LookUps', columns: ['Id', 'LookupKey', 'LookupValue', 'LookupType', 'ClientId'], type: 'GET', upsert: '' },
    { api: 'uniformats/', table: 'Uniformats', columns: ['Id', 'Code', 'Description', 'ClientId'], type: 'GET', upsert: '' },
    { api: 'systemtypes/', table: 'SystemTypes', columns: ['Id', 'Code', 'Description', 'ClientId'], type: 'GET', upsert: '' },
    {
        api: 'userdefinedfields',
        table: 'UserDefinedFields',
        type: 'POST',
        body: { 'PageNumber': 1, 'DataHash': [], 'ClientId': -1 },
        upsert: ` ON CONFLICT(Id) DO UPDATE SET Name=excluded.Name,Label=excluded.Label,Position=excluded.Position,Type=excluded.Type,DataType=excluded.DataType,IsRequired=excluded.IsRequired,MinValue=excluded.MinValue,MaxValue=excluded.MaxValue,MaxLength=excluded.MaxLength,"Precision"=excluded."Precision",
        Scale=excluded.Scale,PropertyDataType=excluded.PropertyDataType,"Values"=excluded."Values",LookupTypeClass=excluded.LookupTypeClass,
        Hash=excluded.Hash, SyncedOn=excluded.SyncedOn where Id=excluded.Id`,
        columns: ['Id', 'Name', 'Label', 'Position', 'Type', 'DataType', 'IsRequired', 'MinValue', 'MaxValue', 'MaxLength', '"Precision"', 'Scale', 'PropertyDataType', '"Values"', 'LookupTypeClass', 'Hash', 'TemplateId', 'SyncedOn']
    },
];

export const buildingAPIS: APISqlite[] = [
    { api: 'buildings/', table: 'Buildings', columns: ['Id', 'BuildingId', 'Name', 'ClientId', 'FMZId', 'PhysicalLocationId', 'Active'], type: 'GET', upsert: '' },
    { api: 'floors/', table: 'Floors', columns: ['Id', 'Code', 'Description', 'PhysicalLocationId'], type: 'GET', upsert: '' },
    { api: 'areas/', table: 'Area', columns: ['Id', 'Code', 'Description', 'FloorId'], type: 'GET', upsert: '' },
    {
        api: 'buildingitems',
        table: 'Equipment',
        type: 'POST',
        body: { 'PageNumber': 1, 'DataHash': [], 'BuildingId': '' },
        upsert: ` ON CONFLICT(Id) DO UPDATE SET  
        Number=excluded.Number,
        Description=excluded.Description,
        FrenchDescription=excluded.FrenchDescription,
        ConditionRating=excluded.ConditionRating,
        CriticalityCode=excluded.CriticalityCode,
        ClientCode=excluded.ClientCode,
        FieldItemNumber=excluded.FieldItemNumber,
        Model=excluded.Model,
        ModelName=excluded.ModelName,
        StartDate=excluded.StartDate,
        KeyDate=excluded.KeyDate,    
        Ownership=excluded.Ownership,
        ParentItemId=excluded.ParentItemId,
        ParentItemNumber=excluded.ParentItemNumber,
        PartWarrantyExpirationDate=excluded.PartWarrantyExpirationDate,
        LabourWarrantyExpirationDate=excluded.LabourWarrantyExpirationDate,
        AcquisitionStatus=excluded.AcquisitionStatus,
        DispositionStatus=excluded.DispositionStatus,
        VendorName=excluded.VendorName,
        Heritage=excluded.Heritage,
        InstallationDate=excluded.InstallationDate,   
        Uniformat=excluded.Uniformat,
        Location=excluded.Location,
        SpecificLocation=excluded.SpecificLocation,
        SerialNumber=excluded.SerialNumber,
        MaintenanceResponsibility=excluded.MaintenanceResponsibility,
        PurchaseDate=excluded.PurchaseDate,
        PurchasePrice=excluded.PurchasePrice,
        BuildingId=excluded.BuildingId,
        FloorId=excluded.FloorId,
        AreaId=excluded.AreaId,
        SystemTypeId=excluded.SystemTypeId,
        UserDefined=excluded.UserDefined,
        ManufacturedDate=excluded.ManufacturedDate,
        Manufacturer=excluded.Manufacturer,
        Status=excluded.Status,
        Inactive=excluded.Inactive,
        EqCrossReferenceId=excluded.EqCrossReferenceId,
        Hash=excluded.Hash, 
        SyncedOn=excluded.SyncedOn where Id=excluded.Id`,
        columns: ['Id', 'Number', 'Description', 'FrenchDescription', 'ConditionRating', 'CriticalityCode', 'ClientCode', 'FieldItemNumber', 'Model',
            'ModelName', 'StartDate', 'KeyDate', 'Ownership', 'ParentItemId', 'ParentItemNumber', 'PartWarrantyExpirationDate',
            'LabourWarrantyExpirationDate', 'AcquisitionStatus', 'DispositionStatus', 'VendorName', 'Heritage', 'InstallationDate',
            'Uniformat', 'Location', 'SpecificLocation', 'SerialNumber', 'MaintenanceResponsibility', 'PurchaseDate', 'PurchasePrice',
            'BuildingId', 'FloorId', 'AreaId', 'SystemTypeId', 'UserDefined', 'Hash', 'SyncedOn', 'IsDFM', 'ClientId', 'Manufacturer', 'ManufacturedDate', 'Status', 'Inactive', 'EqCrossReferenceId']
    },
];

export const API_Sqlite: APISqlite[] = [
    ...clientAPIS, ...buildingAPIS
];

export class APISqlite {
    api: string; table: string; columns: string[] = []; upsert: string; type?: string; body?: any
}   