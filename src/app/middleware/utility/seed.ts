export let sql = "Drop Table If Exists Regions;";
sql += "Drop Table If Exists FMZ;"
sql += "Drop Table If Exists UserDefinedTemplate;"
sql += "Drop Table If Exists UserDefinedFields;"
sql += "Drop Table If Exists Buildings;"
sql += "Drop Table If Exists Floors;"
sql += "Drop Table If Exists Area;"
sql += "Drop Table If Exists Uniformats;"
sql += "Drop Table If Exists SystemTypes;"
sql += "Drop Table If Exists LookUps;"
sql += "Drop Table If Exists Equipment;"
sql += "Drop Table If Exists NOTIFICATIONSTATUS;"
sql += "Drop Table If Exists DATASYNC;"
sql += "Drop Table If Exists HTTPLOG;"

sql += 'CREATE TABLE IF NOT EXISTS Regions (Id NOT NULL PRIMARY KEY, Name, Description);';

//FMZ
sql += "CREATE TABLE IF NOT EXISTS FMZ (Id NOT NULL PRIMARY KEY, Name, FacilityManager, Description, RegionId);";

//User defined templates
sql += "CREATE TABLE IF NOT EXISTS UserDefinedTemplate (ClientId, Id NOT NULL PRIMARY KEY, BuildingItemTypeCode, Name);";

//User defined fields
sql += 'CREATE TABLE IF NOT EXISTS UserDefinedFields (Id NOT NULL PRIMARY KEY, Name, Label, Position, Type, DataType, IsRequired, MinValue, MaxValue, MaxLength, "Precision", Scale, PropertyDataType, "Values", LookupTypeClass, Hash,TemplateId, SyncedOn);';

//Buildings
sql += "CREATE TABLE IF NOT EXISTS Buildings (Id NOT NULL PRIMARY KEY, BuildingId, Name, ClientId, FMZId, PhysicalLocationId, Active);";

//Floors
sql += "CREATE TABLE IF NOT EXISTS Floors (Id NOT NULL PRIMARY KEY, Code, Description, PhysicalLocationId);";

//Areas
sql += "CREATE TABLE IF NOT EXISTS Area (Id NOT NULL PRIMARY KEY, Code, Description, FloorId);";

//Uniformats
sql += "CREATE TABLE IF NOT EXISTS Uniformats (Id NOT NULL PRIMARY KEY, Code, Description, ClientId);";

//SystemTypes
sql += "CREATE TABLE IF NOT EXISTS SystemTypes (Id NOT NULL PRIMARY KEY, Code, Description, ClientId);";

//LookUps
sql += "CREATE TABLE IF NOT EXISTS LookUps (Id NOT NULL PRIMARY KEY, LookupKey, LookupValue, LookupType, ClientId);";

//Equipments
sql += `CREATE TABLE IF NOT EXISTS Equipment (
        Id NOT NULL PRIMARY KEY,
        Number,
        Description,
        FrenchDescription,
        ConditionRating,
        CriticalityCode,
        ClientCode,
        FieldItemNumber,
        Model,
        ModelName,
        StartDate,
        KeyDate,    
        Ownership,
        ParentItemId,
        ParentItemNumber,
        PartWarrantyExpirationDate,
        LabourWarrantyExpirationDate,
        AcquisitionStatus,
        DispositionStatus,
        VendorName,
        Heritage,
        InstallationDate,   
        Uniformat,
        Location,
        SpecificLocation,
        SerialNumber,
        MaintenanceResponsibility,
        PurchaseDate,
        PurchasePrice,
        BuildingId,
        FloorId,
        AreaId,
        SystemTypeId,
        UserDefined,
        Hash, 
        IsDFM,
        Manufacturer,
        ManufacturedDate,
        ClientId,
        Status,
        Inactive,
        EqCrossReferenceId,
        SyncedOn
);`;



// sql += 'CREATE UNIQUE INDEX IF NOT EXISTS EQNUM_IDX ON EQUIPMENT (EQUIPMENT_ID, EQNUM);'

sql += 'CREATE TABLE IF NOT EXISTS QUEUE (ID INTEGER PRIMARY KEY AUTOINCREMENT, [URL], [TYPE], [DATA], [SYNCSTATUS], NOTIFIED, CREATEDON);';

sql += 'CREATE TABLE IF NOT EXISTS DATASYNC (TABLENAME, COLUMNLIST, APIURL, TYPE, UPSERT, PageNumber, LASTSYNCEDON);';

sql += 'CREATE TABLE IF NOT EXISTS SYNCLOG (TABLENAME, ERRORMSG, CREATEDON);';

sql += 'CREATE TABLE IF NOT EXISTS NOTIFICATIONSTATUS (SENTON);';

sql += 'CREATE TABLE IF NOT EXISTS HTTPLOG (ID INTEGER PRIMARY KEY AUTOINCREMENT, [URL], [TYPE], [DATA], [ERROR], OCCUREDON)'