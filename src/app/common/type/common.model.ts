export class InputConReturn {

  name: string;
  value: string;
  isBlur: boolean;
}

export class EquipmentSubHeader {
  subheaderitems: EquipmentSubHeaderItem[];
  total: number;
}

export class EquipmentSubHeaderItem {
  name: string;
  description: string;
  isCurrentStep: boolean;
  isFinished: boolean;
  title: string;
  subline: string;
  step: number;
  mode: number = 1;
}

export interface Photo {
  filepath: string;
  webviewPath: string;
  base64Data: string;
}

export class SearchEquipmentResponse {
  ListEquipments: EquipmentRecord[];
  BuildingId: string;
}

export class EquipmentRecord {
  BuildingId: string;
  SerialNum: string;
  ModelNumber: string;
  ModelName: string;
  Manufacturer: string;
  FieldItemNum: string;
  SystemType: string;
  EqtypeCode: string;
  Description: string;
  EquipmentId: number;
  ShortDesc: string;
  Eqnum: string;
  Status: string;
  IsDFM: string;
}

export class BuildingRecord {
  BuildingId: string;
  BuildingDesc: string;
  ClientId: string;
  IsDFM: string;
  Address?: string
}

export class GetEquipmentsRequest {

  BuildingId: string;
  Clients: string;
  UserId: string;
}

export class ApprovalPortalFilter{
  PageNumber: number;
  PageSize : number;
  Clients :string="";
  //Status:string="";
  OldValue:string="";
  NewValue:string="";
  BuildingItemNumber:string="";
  ReasonRejection:string="";
  RequestDate:string="";
  Location:string="";
  Comments:string="";
  Approver:string="";
  ListStatus:string="";
}

export class EquipmentChangeSearchResults{
  TotalCount:number;
  SearchResults:EquipmentChangeSearchResult[];
}


export class EquipmentChangeSearchResult{
  RequestId:number;
  EquipmentId:number;
  ClientId:number;
  RequestSource:string="";
  InitialApproversList:string="";
  CurrentApproversList:string="";
  BuildingItemNo:string="";
  EquipmentNo:string="";
  RequestDate:Date;
  sRequestDate:string="";
  Location:string="";
  LocationID:number;
  Approver:string="";
  State:string="";
  CreatedBy :string="";
  UpdateDate :Date;
  UpdatedBy :string="";
  EquipmentEntityChanges:EquipmentEntityChange[];
  isChecked:boolean
  updated:EquipmentEntityChange[];
  isOpen:boolean;
}

export class EquipmentEntityChange{
  ChangeId:number;
  RequestId:number;
  ClientId:number;
  OldValue:string="";
  NewValue:string="";
  Status:string="";
  ChangeRequestNotes:string="";
  ApprovedBy:string="";
  RejectedBy:string="";
  InitialApproversList:string="";
  CurrentApproversList:string="";
  Comments:string="";
  showReasonSearchDialog:boolean;
  isCheckedDetail:boolean;
  reason:any;
  EntityField:string="";
  CanBeApproved:boolean;
}

export enum storageVariableNames {

  STOREAGEDATA = 'STORATE-DATA',
  STEPDATAVAL = 'STEP-VAL-DATA',
  STEP1DATACLIENTINFO = 'STEP1-CLIENT-INFO',
  STEP1DATAVAL = 'STEP1-EQUIPMENT-STEP1DATAVAL',
  STEP2DATAEQIPMENTTYPE = 'STEP2-EQUIPMENT-TYPE',
  STEP2DATAVAL = 'STEP2-EQUIPMENT-STEP2DATAVAL',

  STEP3DESCRIPTION = 'STEP3-EQUIPMENT-DESC',
  STEP3DATAVAL = 'STEP3-EQUIPMENT-DETAILVAL',

  STEP4DATAWARRENTY = 'STEP4-WARRENTY',
  STEP4DATAVAL = 'STEP4-EQUIPMENT-STEP4DATAVAL',
  SEARCHEQUIPMENT = 'SEARCHEQUIPMENT',
  SUBHEADER = 'SUBHEADER',
  MODE = 'MODE',
  MODEEDIT = 'EDIT',
  MODEADD = 'ADD',
  MODEEQUIPSEARCH = 'MODEEQUIPSEARCH',
  EUIIPMENTDETAILGET = 'EUIIPMENTDETAILGET',

  HOME = "/tabs/tab1",
  MYREQUEST = "/tabs/tab2",
  STEPSEARCHEDIT = "/tabs/tab1/search-edit-equipment",
  STEP1NAV = '/tabs/equipmentadd/equipment-step1-client',
  STEP2NAV = '/tabs/equipmentadd/equipment-step2-type',
  STEP3NAV = '/tabs/equipmentadd/equipment-step3-description',
  STEP4NAV = '/tabs/equipmentadd/equipment-step4-warranty',
  STEP5NAV = '/tabs/equipmentadd/equipment-step5-summary',
  EDITEQUIPMENT = "/tabs/edit-equipment",
  MYACCOUNT = '/tabs/profile/my-account',
  PREFERENCES = '/tabs/profile/preferences',
  NOTIFICATIONS = '/tabs/profile/notifications',
  LOGOUT = '/login',
}
