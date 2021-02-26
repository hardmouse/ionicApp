
PROMPT Rebuild Invalid Index

DECLARE CURSOR invaliIndex IS
with V_SUB AS
(
SELECT index_name
FROM all_ind_subpartitions
WHERE status != 'USABLE'
)
,V_PART AS
(
SELECT index_name
FROM all_ind_partitions
WHERE status != 'USABLE' AND 
     (status != 'N/A' OR index_name IN (select * from V_SUB))
)
SELECT owner,index_name
FROM all_indexes
WHERE owner NOT IN ('SYS', 'SYSTEM') AND 
      status != 'VALID' AND  (status != 'N/A' OR index_name IN (select * from V_PART )) ;
BEGIN
DBMS_OUTPUT.put_line ( 'Start Rebuild index ' );
FOR rec IN invaliIndex LOOP
  DBMS_OUTPUT.put_line ( 'Rebuild index : ' || rec.index_name  );
  BEGIN
     EXECUTE IMMEDIATE ('alter index '||rec.owner||'.'||rec.index_name ||' rebuild online logging') ;
  EXCEPTION
     WHEN OTHERS
     THEN
        DBMS_OUTPUT.put_line ( 'Error in rebuild index : ' || rec.index_name  );
  END;
END LOOP;
END;
/
