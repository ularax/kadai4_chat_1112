// <!--** 以下Firebase **-->
// <!-- Firebaseからコピーする -->
// <!-- <script type="module">
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";

    // 別のサンプルファイルから以下のコードをコピペして追加する
    // import { getDatabase, ref, push, set, onChildAdded, remove,onChildRemoved } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries


    // <!--** Firebase キー**-->
    // Your web app's Firebase configuration
    
    // <!--** Firebase キー**-->


    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // FirebaseのRealtime Databaseを使うための二行を記述する
    // const db = getDatabase(app);
    // const dbRef = ref(db, 'PetCare');

    import {
            getStorage,
            ref as sRef,
            uploadBytesResumable,
            getDownloadURL,
        } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";

        import {
            getFirestore,
            doc,
            getDoc,
            setDoc,
            collection,
            addDoc,
        } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
        const clouddb = getFirestore();

        // -----------------------------------------------

        let files = [];
        let reader = new FileReader();

        let namebox = document.getElementById("namebox");
        let extlab = document.getElementById("extlab");
        let myimg = document.getElementById("myimg");
        let proglab = document.getElementById("upprogress");
        let SelBtn = document.getElementById("selbtn");
        let UpBtn = document.getElementById("upbtn");
        let DownBtn = document.getElementById("downbtn");

        let input = document.createElement("input");
        input.type = "file";

        console.log(input);
        input.onchange = (e) => {
            console.log(e);
            files = e.target.files;

            let extension = GetFileExt(files[0]);
            let name = GetFileName(files[0]);

            namebox.value = name;
            extlab.innerHTML = extension;

            reader.readAsDataURL(files[0]);
        };

        reader.onload = function () {
            myimg.src = reader.result;
        };

        // ----------selection--------------
        SelBtn.onclick = function () {
            console.log(1111);
            input.click();
        };

        function GetFileExt(file) {
            let temp = file.name.split(".");
            let ext = temp.slice(temp.length - 1, temp.length);
            return "." + ext[0];
        }

        function GetFileName(file) {
            let temp = file.name.split(".");
            let fname = temp.slice(0, -1).join(".");
            return fname;
        }

        // -------------upload-------------------------

        async function UploadProcess() {
            let ImgToUpload = files[0];

            let ImgName = namebox.value + extlab.innerHTML;

            const metaData = {
                contentType: ImgToUpload.type,
            };
            const storage = getStorage();

            const storageRef = sRef(storage, "Images/" + ImgName);

            const UploadTask = uploadBytesResumable(
                storageRef,
                ImgToUpload,
                metaData
            );

            UploadTask.on(
                "state-changed",
                (snapshot) => {
                    let progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) *
                        100;
                    proglab.innerHTML = "Upload " + progress + "%";
                    console.log(snapshot);
                },
                (error) => {
                    alert("エラーです！アップロードできてません！！");
                },
                () => {
                    getDownloadURL(UploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            SaveURLtoFirestore(downloadURL);
                            console.log(downloadURL);
                        }
                    );
                }
            );
        }
        // --------------------------- functions for firestore database---------------------------

        // 非同期処理
        async function SaveURLtoFirestore(url) {
            let name = namebox.value;
            let ext = extlab.innerHTML;

            let ref = doc(clouddb, "ImageLinks/" + name);

            await setDoc(ref, {
                ImageName: name + ext,
                ImageURL: url,
            });
        }

        async function GetImagefromFirestore() {
            let name = namebox.value;

            let ref = doc(clouddb, "ImageLinks/" + name);

            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                myimg.src = docSnap.data().ImageURL;
            }
        }

        UpBtn.onclick = UploadProcess;
        DownBtn.onclick = GetImagefromFirestore;





// </script> -->
