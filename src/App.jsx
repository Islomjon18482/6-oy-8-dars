import "./App.css";
import Delete from "./assets/delete.svg";
import Edit from "./assets/edit.svg";
import { useState, useRef, useEffect } from "react";

function App() {
  const textRef = useRef();
  const [allData, setAllData] = useState([]);
  const [showBtn, setShowBtn] = useState(true)
  const [editedId, setEditedId] = useState(0)
  const [status, setStatus] = useState("inactive")

  useEffect(() => {
    if (localStorage.getItem("info")) {
      setAllData(JSON.parse(localStorage.getItem("info")));
    }
  }, []);



  function sendInfo(e) {
    e.preventDefault();

    const todo = {
      text: textRef.current.value,
      id: Date.now(),
      status: "inactive",
    };

    if (textRef.current.value.trim().lenght <= 3 || !textRef.current.value.trim()) {
      textRef.current.focus();
      return;
    }
    let copyData = [];
    if (localStorage.getItem("info")) {
      copyData = JSON.parse(localStorage.getItem("info"));
    }
    copyData.push(todo);
    setAllData(copyData);
    localStorage.setItem("info", JSON.stringify(copyData));

    textRef.current.value = ''
  }


  function deleteList(element){
    let copyData = JSON.parse(localStorage.getItem("info")) 
    copyData = copyData.filter((el)=>{
      return el.id != element.id
    })
    setAllData(copyData)
    localStorage.setItem("info", JSON.stringify(copyData))
  }


  function edit(element){
    textRef.current.value = element.text
    setShowBtn(false)
    setEditedId(element.id)
  }

  function editTodo(e){
    e.preventDefault();
    let copyData = JSON.parse(localStorage.getItem("info")) ? JSON.parse(localStorage.getItem("info")) : []
    copyData.map((el)=>{
      if(el.id == editedId){
        el.text = textRef.current.value
      }
    })
    localStorage.setItem("info", JSON.stringify(copyData))
    setAllData(copyData)
    textRef.current.value = ""
    setShowBtn(true)
  }

  function change(e, element){
    let copyData = JSON.parse(localStorage.getItem("info")) ? JSON.parse(localStorage.getItem("info")) : []
    copyData.map((el)=>{
      if(el.id == element.id){
        if(el.status == "inactive"){
          el.status = "active"
          setStatus("active")
        }else{
          el.status = "inactive"
          setStatus("inactive")
        }
      }
      return el
    })

    localStorage.setItem("info", JSON.stringify(copyData))
    setAllData(copyData)
  }

  return (
    <>
      <form>
        <div className="container">
          <div className="wrapper">
            <input
              ref={textRef}
              required
              type="text"
              name="text"
              className="input"
            />
            <label className="label">Enter to do</label>
            {
              showBtn && <button onClick={sendInfo}>Submit</button>
            }
            {
              
              !showBtn && <button onClick={editTodo}>Upgrade</button>
            }
          </div>
        </div>
        <div className="list">
          <ul>
            {allData.map((element, index) => {
              return (
                <li key={index}>
                  <div className="text__chec">
                    <input onChange={(e)=> change(e, element)}  checked={element.status=="active" ? true : false}  type="checkbox" name="" id="" />
                    <span>{element.text}</span>
                  </div>
                  <div className="actions">
                    <img onClick={()=> deleteList(element)} src={Delete} alt="" />
                    <img onClick={()=> edit(element)} src={Edit} alt="" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </form>
    </>
  );
}

export default App;
