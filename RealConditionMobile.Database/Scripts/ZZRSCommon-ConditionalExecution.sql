SET DEFINE ON
SET VERIFY OFF
SET FEEDBACK OFF
SET TIMING OFF
--------------- Dummy script to show a message 
HOST echo PROMPT CONDITIONAL EXECUTION BLOCKED SCRIPT "<&&THEN_SCRIPT>" > null.sql
-------------------------------------------------------------------------------------
--------------- Define column variable if they are not already defined
col p1 new_value 1 NOPRINT ;
col THEN_COL new_value THEN_SCRIPT NOPRINT ;
col ELSE_COL new_value ELSE_SCRIPT NOPRINT ;
select null p1, null THEN_COL, null ELSE_COL from dual where  1=2;
-------------------------------------------------------------------------------------
--Define a column variable to hold name of scrip based on the condition
COL SCRIPT_COL NEW_VALUE SCRIPT NOPRINT ;
SELECT CASE WHEN &&1 THEN '&&THEN_SCRIPT' WHEN NOT LENGTH('&&ELSE_SCRIPT') IS NULL THEN '&&ELSE_SCRIPT' ELSE 'null.sql' END AS SCRIPT_COL FROM DUAL;
-------------------------------------------------------------------------------------
---------------RUN SCRIPT
@@ &SCRIPT
---------------DEFAULT SETTING
SET DEFINE OFF
SET FEEDBACK ON
