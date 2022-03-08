import { useSearchParams } from "react-router-native";

export default function Index() {

    if (typeof window !== "object") {

        let [searchParams, setSearchParams] = useSearchParams();
        console.log(searchParams);

        const mysql = require("mysql");

        let conn = mysql.createConnection({
            host: "localhost",
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS
        });

        conn.connect(function(err) {
            if (err)
                console.log(err);
            else
                console.log("Connected!");
        });
    }

    return (
        null
    );
}