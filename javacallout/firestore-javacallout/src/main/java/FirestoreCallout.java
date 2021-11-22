import com.apigee.flow.execution.Action;
import com.apigee.flow.execution.ExecutionContext;
import com.apigee.flow.execution.ExecutionResult;
import com.apigee.flow.execution.spi.Execution;
import com.apigee.flow.message.MessageContext;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.common.collect.ImmutableMap;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

//import com.apigee.flow.execution.IOIntensive;

public class FirestoreCallout implements Execution {
    private Map<String,String> properties; // read-only
    private Firestore db;

    public FirestoreCallout(Map properties) {
        // convert the untyped Map to a generic map
        Map<String,String> m = new HashMap<String,String>();
        Iterator iterator = properties.keySet().iterator();
        while(iterator.hasNext()){
            Object key = iterator.next();
            Object value = properties.get(key);
            if ((key instanceof String) && (value instanceof String)) {
                m.put((String) key, (String) value);
            }
        }
        this.properties = m;

        // [START fs_initialize_project_id]
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance().toBuilder()
                        .setProjectId("apigee-developer-labs")
                        .build();
        Firestore db = firestoreOptions.getService();
        // [END fs_initialize_project_id]
        this.db = db;
    }

    public ExecutionResult execute (MessageContext msgCtxt, ExecutionContext exeCtxt) {
        try {
            //String braintreeEnvironment = getProperty("braintreeEnv", msgCtxt);

            String firestoreKey = getProperty("firestoreKey", msgCtxt);
            String docId = getProperty("docId", msgCtxt);
            String collectionName = getProperty("collectionName", msgCtxt);
            addDocument("alovelace");

            msgCtxt.setVariable("flw.firestore.status", "success");

        } catch (Exception ex) {
            ExecutionResult executionResult = new ExecutionResult(false, Action.ABORT);
            executionResult.setErrorResponse(ex.getMessage());
            executionResult.addErrorResponseHeader("x-Exception-Class", ex.getClass().getName());
            msgCtxt.setVariable("flw.firestore.status", "fail");
            return executionResult;
        }
        return ExecutionResult.SUCCESS;
    }

    void addDocument(String docName) throws Exception {
        switch (docName) {
            case "alovelace": {
                // [START fs_add_data_1]
                DocumentReference docRef = db.collection("users").document("alovelace");
                // Add document data  with id "alovelace" using a hashmap
                Map<String, Object> data = new HashMap<>();
                data.put("first", "Ada");
                data.put("last", "Lovelace");
                data.put("born", 1815);
                //asynchronously write data
                ApiFuture<WriteResult> result = docRef.set(data);
                // ...
                // result.get() blocks on response
                System.out.println("Update time : " + result.get().getUpdateTime());
                // [END fs_add_data_1]
                break;
            }
            case "aturing": {
                // [START fs_add_data_2]
                DocumentReference docRef = db.collection("users").document("aturing");
                // Add document data with an additional field ("middle")
                Map<String, Object> data = new HashMap<>();
                data.put("first", "Alan");
                data.put("middle", "Mathison");
                data.put("last", "Turing");
                data.put("born", 1912);

                ApiFuture<WriteResult> result = docRef.set(data);
                System.out.println("Update time : " + result.get().getUpdateTime());
                // [END fs_add_data_2]
                break;
            }
            case "cbabbage": {
                DocumentReference docRef = db.collection("users").document("cbabbage");
                Map<String, Object> data =
                        new ImmutableMap.Builder<String, Object>()
                                .put("first", "Charles")
                                .put("last", "Babbage")
                                .put("born", 1791)
                                .build();
                ApiFuture<WriteResult> result = docRef.set(data);
                System.out.println("Update time : " + result.get().getUpdateTime());
                break;
            }
            default:
        }
    }

    void runAQuery() throws Exception {
        // [START fs_add_query]
        // asynchronously query for all users born before 1900
        ApiFuture<QuerySnapshot> query =
                db.collection("users").whereLessThan("born", 1900).get();
        // ...
        // query.get() blocks on response
        QuerySnapshot querySnapshot = query.get();
        List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            System.out.println("User: " + document.getId());
            System.out.println("First: " + document.getString("first"));
            if (document.contains("middle")) {
                System.out.println("Middle: " + document.getString("middle"));
            }
            System.out.println("Last: " + document.getString("last"));
            System.out.println("Born: " + document.getLong("born"));
        }
        // [END fs_add_query]
    }

    void retrieveAllDocuments() throws Exception {
        // [START fs_get_all]
        // asynchronously retrieve all users
        ApiFuture<QuerySnapshot> query = db.collection("users").get();
        // ...
        // query.get() blocks on response
        QuerySnapshot querySnapshot = query.get();
        List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            System.out.println("User: " + document.getId());
            System.out.println("First: " + document.getString("first"));
            if (document.contains("middle")) {
                System.out.println("Middle: " + document.getString("middle"));
            }
            System.out.println("Last: " + document.getString("last"));
            System.out.println("Born: " + document.getLong("born"));
        }
        // [END fs_get_all]
    }

    /*
    Retrieve a property from the properties collection.
     */
    private String getProperty(String property, MessageContext msgCtxt) {
        String result = this.properties.get(property);
        if(result == null){
            throw new IllegalStateException(property + " was not supplied in the Java Callout.");
        } else {
            if (result.startsWith("{") && result.endsWith("}") && (result.indexOf(" ") == -1)) {
                String varname = result.substring(1,result.length() - 1);
                String value = msgCtxt.getVariable(varname);
                return value;
            }
            return result;
        }
    }
}
