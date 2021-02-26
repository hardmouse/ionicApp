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
Prompt ====================RCM_OPTIONS.TABLE.sql==============
@@..\Tables\RCM_OPTIONS.TABLE.sql

Prompt ====================INSERT_SEC_TRUSTEDSERVER.sql==============
@@..\Tables\INSERT_SEC_TRUSTEDSERVER_RCM_SSO_RECORD.sql

Prompt ====================INSERT_LANGUAGE_DICTIONARY_CLIENT.sql==============
@@..\Tables\INSERT_LANGUAGE_DICTIONARY_CLIENT.sql


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