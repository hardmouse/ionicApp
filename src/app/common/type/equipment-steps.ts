
export class Result{
    Success: boolean;
    ErrorMessage: string;
    OtherValue : string;
}

export class ListItem{
    Key:string;
    Value:string;
    ParentFieldName: string;
    ParentId: string;
}
export class RadioListItem{
    Key:string;
    Value:string;
    Checked:boolean;
}

export class SmartInput{
    ListOfItems:ListItem[];
    ListOfLinkedParentItems: ListItem[];
    IsDropdown: boolean;
    DefaultValue: string;
    Description: string;
    ValueType: string;
    MaxLength: number;
    IsReqire: boolean;
    DisplayTitle: string;
    ValidationRegularExpression: string;
    ErrorDescription: string;
}

export class Uniformat{
    Id:string;
    FlexTemplateId :string;
    Code:string;
    UDescription:string; 
    UDescList:UniformatDescription[];
  }
  
  export class UniformatDescription{
    UDF:string;
    LookupName:string;
    Description:string;
    ListOfItems:ListItem[];
    showOptions:boolean;
    showNoResult:boolean;
    FilterOptions:ListItem[];
    UDFOptionSearchValue:string;
    UDFOptionSearchValueBak:string;
    UDFOptionSearchKey:string;
    isSearchValueValid:boolean = true;
    ControlType:number;
    DataType:string;
    Legnth:number;
    IsRequired:boolean;
    MinValue:number;
    MaxValue:number;
    ErrorDescription:string;
    Id:string;
    Name:string;
  }
  
  export class UniformatOptions{
    Item:string;
  }
  

export class Step1ClientData{
    RegionId: number;
    RegionDescription: string;
    FmzId: number;
    FmzDescription: string;
    BuildingId: string;
    BuildingDescription: string;
    Floor:SmartInput;
    Area:SmartInput;
    ClientCode:SmartInput;
    ClientLocation:SmartInput;
    SpecificLocation:SmartInput;
    VALDATA:Step1ValidationData;
    DIRTYDATA:Step1ValidationData;
}

export class Step1Client{
    Result:Result;
    Data:Step1ClientData;
}

export class Step2EquipTypeData{
    IsDFM:string;
    EqNum:string;
    Status:string;
    RegionId: number;
    FieldItemNumber:string;
    RegionDescription: string;
    SystemType:SmartInput;
    BuildingItemType:SmartInput;
    BuildingItemTypeCodes:Uniformat[];
    UniformatSelectedKey:string;    
    ParentItem:SmartInput;
    ParentItemSelectedKey:string;
    Manufacturer:string;
    ModelNumber :string;
    ModelName:string;
    SerialNumber:string;
    ManufacturedDate:Date;
    BuildingEquipments:SmartInput;
    BuildingEquipmentsSorted:SmartInput;
    VALDATA : Step2ValidationData;
    DIRTYDATA:Step2ValidationData;
}

export class Step2EquipmentType{
    Result:Result;
    Data:Step2EquipTypeData;
}

export class StorageData{
    Step1: Step1Client;
    Step2: Step2EquipTypeData;
}

export class RequestEquimentCode{
    BuildingId:string;
    BuildingItemTypeCode:string;
    SystemTypeCode:string;
    UnitCode:string;
    BuildingItemId:string;
}

export class RequestEquiment{
    BuildingId:string;
    BuildingItemId:string;
    FloorId:string;
}

export class Step2ValidationData{

  UniformatSelected:Uniformat = new Uniformat();  
  showUniformatSearchList:boolean=false;  
  isUfmInputValid:boolean=true;
  isBuildingItemValid:boolean=true;
  showSystemTypeSearchList:boolean=false;  
  isSystemTypeValid:boolean=true;
  isDescValid:boolean=true;
  FieldItemNumber:string="";
  isFieldItemNumberValid:boolean=true;
  ModelNumber :string="";
  ModelName:string="";
  ManufacturerDate:Date;
  sManufacturerDate:string="";
  Manufacturer:string="";
  SerialNumber:string="";
  UniformatSearchValue:string="";
  UniformatSearchKey:number;
  BuildingItemValue:string="";
  SystemTypeValue:string="";
  SystemTypeKey:string="";
  DescriptionValue:string="";
  DescriptionFrValue:string="";
  BuildingItemCode:string="";
  ParentItemSearchValue:string="";
  ParentItemSearchKey:string="";
  showParentItemSearchList:boolean=false;
  showUDFSearchList:boolean;
  IsDFM:string = "";
}

export class Step1ValidationData{
  isInSideBuilding:number = 0;
  showFloorSearchList:boolean;
  floorSearchValue:string="";
  floorSearchKey:string="";
  showAreaRow:boolean=false;
  showFloorRow:boolean=false;
  CriticalityValue:string="";
  isInHerigageArea:boolean=false;
  showAreaSearchList:boolean;
  areaSearchValue:string="";
  areaSearchKey:string="";
  RegionId:number;
  FmzId:number;
  BuildingId:string;
  RegionDesc:string="";
  FMZDesc:string="";
  BuildingDesc:string="";
  isInsideBuilding:number=0;
  isAreaInputValid:boolean=true;
  isFloorInputValid:boolean=true;
  isCriticalityValid:boolean=true;
  ClientCode:string="";
  ClientLocation:string="";
  SpecificLocation:string=""
}

export class Step3DescriptionData{
    DispositionStatus:SmartInput;
    VALDATA : Step3ValidationData;
    DIRTYDATA:Step3ValidationData;
}

export class Step3ValidationData{
    DecommissionedDate:Date;
    ConRateValue:string="";
    isRepExistEqu:boolean = false;
    commentNote:string="";
    status:string="Active";
    attachfiles:Attachement[] = [];
    EquipmentSearchValue:string="";
    EquipmentSearchKey:string="";
    showEquipmentSearchList:boolean;
    EquipmentSelected:ListItem = new ListItem(); 
    files:BgisMediaFile[];
}

export class Attachement{
    type:number; //1 picture 2 video
    name:string="";
    directory:string="";
    blob:ArrayBuffer;
}

export class StepValidationData{
    step1Val: Step1ValidationData = new Step1ValidationData();
    step2Val: Step2ValidationData = new Step2ValidationData();
    step3Val: Step3ValidationData = new Step3ValidationData();
}

export class Step4ValidationData{
    StartDate:string;
    KeyDate:string;
    isMaintenanceResponsibility:boolean;
    WarrantyVenderName:string ="";
    InstallationDate:Date;
    PartsWarrantyDate:Date;
    LabourWarrantyDate:Date;
    PurchaseDate:Date;
    sInstallationDate:string="";
    sPartsWarrantyDate:string="";
    sLabourWarrantyDate:string="";
    sPurchaseDate:string="";

    PurchasePrice:string="";
    isPurchasePriceValid:boolean;
    OwnershipValue:string="";
    OwnershipKey:string="";
    showOwnershipValue:boolean;
    AcquisitionStatusValue:string="";
    AcquisitionStatusKey:string="";
    showAcquisitionStatusValue:boolean;
    DispositionStatus:string="";
    DispositionStatusKey:string="";
    showDispositionStatus:boolean;
    ResponsibilityValue:string="";
    ResponsibilityKey:string="";
    showConResponsibilityList:boolean;
    isResponsibilityValueValid:boolean=true;
    PMResponsibilityComment:string="";
    isPMResponsibilityCommentValid:boolean=true;
}

export class Step4WarrantyData{
    Ownership:SmartInput;
    AcquisitionStatus:SmartInput;
    DispositionStatus:SmartInput;
    VALDATA : Step4ValidationData;
    DIRTYDATA:Step4ValidationData;
}

export class Step4Procurement{
    Result:Result;
    Data:Step4WarrantyData;
}

export class BgisMediaFile {
    filepath: string;
    webviewPath: string;
    type: string;
    fieldId:string;
    status:string;
    pictureId:number;
}

export class RequestFile {
    FileName : string;
    WebViewPath : string;
    Status:string;
    FieldID:string;
    PictureID:number;
}

export class RequestEquipmentAdd{
    //step1
    isInSideBuilding:boolean;
    floorSearchValue:string="";
    FloorId :number;
    CriticalityCode :string="";
    isInHerigageArea:boolean=true;
    AreaId :number;
    RegionId:number;
    FmzId:number;
    BuildingId:string;
    RegionDesc:string="";
    FMZDesc:string="";
    BuildingDesc:string="";
    ClientCode:string="";
    ClientLocation:string="";
    SpecificLocation:string=""

    //step2
    IsDFM :string="";
    FieldItemNumber:string="";
    ModelNumber :string="";
    ModelName:string="";
    ManufacturedDate:Date;
    Manufacturer:string="";
    SerialNumber:string="";
    BuildingItemTypeDesc :string="";
    BuildingItemTypeId :number;
    BuildingItemId :number;
    SystemTypeId :number;
    Description :string="";
    FrenchDescription :string="";
    EqNum :string="";
    ParentItemId :number;
    Status :string="";
    StatusDesc:string="";
    UnitCode :string="";
    FlexRequest:FlexRequest;

    //step3
    DecommissionedDate:Date;
    ConditionRating :string="";
    isRepExistEqu:boolean = false;
    commentNote:string="";
    
    EquipmentSearchValue:string="";
    CrossRef:number;
    Base64Files :RequestFile[];
    fields:UniformatDescription[];

    //step4
    StartDate:Date;
    KeyDate:Date;
    isMaintenanceResponsibility:boolean;
    VendorName :string ="";
    InstallationDate:Date;
    PartWarrantyExpirationDate :Date;
    LabourWarrantyExpirationDate :Date;
    PurchaseDate :Date;
    PurchasePrice:string="";
    IsPurchasePriceValid :boolean;
    Ownership :string="";
    AcquisitionStatus :string="";
    DispositionStatus :string="";
    PMResponsibility :string="";
    PMResponsibilityComment:string="";

    DETAIL1: string;
    DETAIL2: string;
    DETAIL3: string;
    DETAIL4: string;
    DETAIL5: string;
    DETAIL6: string;
    DETAIL7: string;
    DETAIL8: string;
    DETAIL9: string;
    DETAIL10: string;
    DETAIL11: string;
    DETAIL12: string;
    DETAIL13: string;
    DETAIL14: string;
    DETAIL15: string;
    DETAIL16: string;
    DETAIL17: string;
    DETAIL18: string;
    DETAIL19: string;
    DETAIL20: string;
    DETAIL21: string;
    DETAIL22: string;
    DETAIL23: string;
    DETAIL24: string;
    DETAIL25: string;
    DETAIL26: string;
    DETAIL27: string;
    DETAIL28: string;
    DETAIL29: string;
    DETAIL30: string;
}

export class FlexRequest {
    FlexFieldValues:string[][];
    FlexFieldIds:number[];
    FlexObjectId:string;
    Id:string;
}


export interface CreateEquipmentResponse{
    
    BuildingItemId: number;
    EqNum: string;
    Result: Result;
    
}















