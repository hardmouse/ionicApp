--SET SERVEROUTPUT ON SIZE 1000000;

BEGIN
   FOR cursor_record IN (SELECT   object_name, object_type,
                                  DECODE (object_type,
                                          'PACKAGE', 1,
                                          'PACKAGE BODY', 2,
                                          3
                                         ) AS recompile_order
                             FROM user_objects
                            WHERE status = 'INVALID'
                         ORDER BY 3)
   LOOP
      BEGIN
         CASE cursor_record.object_type
            WHEN 'PACKAGE'
            THEN
               EXECUTE IMMEDIATE    'ALTER '
                                 || cursor_record.object_name
                                 || ' COMPILE';
            WHEN 'PACKAGE BODY'
            THEN
               EXECUTE IMMEDIATE    'ALTER PACKAGE '
                                 || cursor_record.object_name
                                 || ' COMPILE BODY';
            WHEN 'PROCEDURE'
            THEN
               EXECUTE IMMEDIATE    'ALTER PROCEDURE '
                                 || cursor_record.object_name
                                 || ' COMPILE';
            WHEN 'FUNCTION'
            THEN
               EXECUTE IMMEDIATE    'ALTER FUNCTION '
                                 || cursor_record.object_name
                                 || ' COMPILE';
            WHEN 'TRIGGER'
            THEN
               EXECUTE IMMEDIATE    'ALTER TRIGGER '
                                 || cursor_record.object_name
                                 || ' COMPILE';
            WHEN 'VIEW'
            THEN
               EXECUTE IMMEDIATE    'ALTER VIEW '
                                 || cursor_record.object_name
                                 || ' COMPILE';
         END CASE;
      EXCEPTION
         WHEN OTHERS
         THEN
            DBMS_OUTPUT.put_line (   cursor_record.object_type
                                  || ' : '
                                  || cursor_record.object_name
                                 );
      END;
   END LOOP;
END;
/

