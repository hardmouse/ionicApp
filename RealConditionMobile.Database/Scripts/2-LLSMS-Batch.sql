SET DEF ON
SPOOL &1
SET DEF OFF
SET TIMING ON
SELECT ora_database_name FROM dual;
SHOW user
PROMPT ====================CheckInvalidObject.sql=====================
@@ ZZRSCommon-CheckInvalidObject.sql
--===============================================================================
--=========================SCRIPT INSERTS START HERE=============================
--===============================================================================



--===============================================================================
--=========================SCRIPT INSERTS END HERE===============================
--===============================================================================
Prompt ====================CompileAllInvalidObject.sql================
@@ ZZRSCommon-CompileAllInvalidObject.sql
commit;
PROMPT ====================CheckInvalidObject.sql=====================
@@ ZZRSCommon-CheckInvalidObject.sql
PROMPT ====================RebuildInvalidIndexes======================
@@ZZRSCommon-RebuildInvalidIndexes.sql
SET TIMING OFF
SPOOL OFF
exit;
/