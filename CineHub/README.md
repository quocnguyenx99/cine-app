# Notes

**getDoc**
: retrieve the contents of a single document using getDoc()

```js
import { doc, getDoc } from "firebase/firestore";

const docRef = doc(db, "cities", "SF");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}
```

**getDocs**
: retrieve multiple documents with one request by querying documents in a collection.

```js
import { collection, query, where, getDocs } from "firebase/firestore";

const q = query(collection(db, "cities"), where("capital", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});
```

<h3 class="bug">Fix bugs: Can't get Facebook photoURL from FB API</h3>

Unfortunately, you'll have to add the access token to the photo url by yourself as Firebase does not and will not support it (as they don't have access to it - you can read more about it here).  
You'll have to do something along the lines of:

```js
firebaseAuth.getCurrentUser().getPhotoUrl() +
  "?access_token=<facebook_access_token>";
```

<h3 class="comp">Blackbackdrop Component</h3>

Tấm phủ nền sử dụng khi gọi một Modal, Popup để người dùng tập trung vào thông báo.

```CSS
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  heigth: 100%;
  background-color: black/60;
  z-index: 5;
```

### Diff between tv_data and movie_data

tv: origin_country || movie: video  
tv: first_air_date || movie: release_date  
tv: original_name || movie: original_title  
tv: name || movie: title  
tv: original_name || movie: original_title

Đối với trending thì tv/ movie có thêm media_type, còn các kết quả gọi từ API khác thì không.

<style> 
  .comp {
    background-color: #ffff88;
    color: black;
  }

  .bug {
    background-color: red;
    color: white;
  }
</style>
