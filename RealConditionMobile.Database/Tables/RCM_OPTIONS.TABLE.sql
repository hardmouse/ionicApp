    DROP TABLE RCM_OPTIONS;
    COMMIT;

    CREATE TABLE SMS.RCM_OPTIONS
      (
        CACHETIMEOUT       NUMBER,
        DURATIONUPCOMINGWO NUMBER,
        DURATIONONGOINGWO  NUMBER,
        CHUNKSIZE          NUMBER,
        DATAREFRESHRATE    NUMBER,
        AutoDownload       Number,
        MapsSearchArea     Number,
        GoogleMapsAPIKey   Varchar2(50)
      );
  
      INSERT INTO RCM_OPTIONS VALUES(36000, 60, 60, 1000, 1, 0, 2, 'AIzaSyCeWUnFl5WXlDcyAxyzRQ3yH2dA8jg40NY');
      COMMIT;

    /