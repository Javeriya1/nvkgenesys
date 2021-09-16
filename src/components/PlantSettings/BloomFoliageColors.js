/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import * as MdIcons from "react-icons/md";
import {connect} from "react-redux";
import { confirmAlert } from 'react-confirm-alert'; 
import Sortable from 'sortablejs';
import Loader from '../ProductManager/Loader'
 import './style.css';
import {getAllSubAttribute,handleAttributeDragDrop,handleAttributeDragSort,handleAttributeDelete,handleZoneInputAction,handleAddZone, showSubSubAttribute, handleSubAttributeUpdate} from '../../actions/attributeAction'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
    class BloomFoliageColors extends Component {
        constructor(props){
            super()
                this.state={
                    errorObj:{
                        formSku:0,
                        bloomColor:0,
                    },
                    sortId: 0,
                    activeId: 0,
                    isEditing:false,
                    name:'',
                    subName:'',
                    laoding:false,
                    subName2:'',
                    selectedID:'',
                    btnLabelAdd:'Add New Color Name ',
                    btnLabelUpdate: 'Update Color Name ',
                    btnLabelCancel:'Cancel',
                    deleteon:false,
                    active:[],
                    inactive:[],
                }
            
        }
        getCatgoryData = ()=>{
            let data = {};
            let active= this.props.zoneCategoryList.filter(data=>data.status ==1)
           let inactive=this.props.zoneCategoryList.filter(data=>data.status ==0)
            this.setState({active:active,inactive:inactive,loading:true})
        }
        componentDidMount(){
            this.props.getAllSubAttribute(14).then(()=>{
                // alert("ji")
                this.getCatgoryData()
            })
            // this.props.getAllSubAttribute(14)
    
        }
        id2List = {
            droppable: 'active',
            droppable2: 'inactive'
        };
        getList = id => {
            console.log(this.state[this.id2List[id]])
            return this.state[this.id2List[id]]
        }
        onDragEnd = result => {
            // alert(result)
           
            const { source, destination } = result;
            console.log(destination)
            // dropped outside the list
            console.log(result)
            if(destination == null)
            return
            if (destination.droppableId=="delete") {
                this.setState({deleteon:true})
                confirmAlert({
                    title: 'Delete Bloom & Foilage Colors ',
                    message: 'Are you sure want to delete the Bloom & Foilage Colors ?',
                    buttons: [
                      {
                        label: 'Yes',
                        onClick: () => {this.onDeleteConfirm(this.state.selectedID)}
                      },
                      {
                        label: 'No',
                        onClick: () => { this.setState({deleteon:false})}
                      }
                    ]
                  });
                return;
            }
        
            if (source.droppableId === destination.droppableId) {
                const items = reorder(
                    this.getList(source.droppableId),
                    source.index,
                    destination.index
                );
        
                let state = { items };
        
                if (source.droppableId === 'droppable2') {
                  
                    if(result.destination.index> result.source.index)
                this.props.handleAttributeDragSort(this.state.inactive[result.source.index].id,this.state.inactive[result.destination.index].id,"down")
                else  this.props.handleAttributeDragSort(this.state.inactive[result.source.index].id,this.state.inactive[result.destination.index].id,"up")
                this.setState({inactive:items});
                }else{
                  
                            //        if(evt.willInsertAfter ==true)
                if(result.destination.index> result.source.index)
                this.props.handleAttributeDragSort(this.state.active[result.source.index].id,this.state.active[result.destination.index].id,"down")
                else  this.props.handleAttributeDragSort(this.state.active[result.source.index].id,this.state.active[result.destination.index].id,"up")
                this.setState({active:items});
                }
                
            } else {
               
                if (source.droppableId === 'droppable2') {
                let task= this.state.inactive.filter(data=>data.id ==this.state.inactive[source.index]["id"])
                          if(task.length > 0){
                            this.props.handleAttributeDragDrop(task[0]).then(data=>{
                                                this.props.getAllSubAttribute(14).then(()=>{
                                    // alert("ji")
                                    this.getCatgoryData()
                                })
                        })
                    }
                }else{
                    console.log(source.droppableId)
                    let task= this.state.active.filter(data=>data.id ==this.state.active[source.index]["id"])
                    console.log(task)
                    if(task.length > 0){
                        this.props.handleAttributeDragDrop(task[0]).then(data=>{
                            this.props.getAllSubAttribute(14).then(()=>{
                            // alert("ji")
                            this.getCatgoryData()
                        })
                  })
              }
        
                }
                const result = move(
                    this.getList(source.droppableId),
                    this.getList(destination.droppableId),
                    source,
                    destination
                );
        
                this.setState({
                    active: result.droppable,
                    inactive: result.droppable2
                });
            }
        };
        onDragStart =(e)=>{
            // alert("hi")
            this.setState({selectedID:e.draggableId})
            console.log(e)
        }
        //  }
 ///sorting and drag and dropping////////////////////////////////
//  onDragOver = (ev)=>{
//     ev.preventDefault();
// }
// startIDData  =(e)=>{
//     this.setState({selectedID:e.item.id})
// }
// onAddData = (evt)=>{
//     console.log(evt)
//     // evt.preventDefault()

//     const referenceNode = (evt.nextSibling && evt.nextSibling.parentNode !== null) ? evt.nextSibling : null; 
//  evt.from.insertBefore(evt.item, null); 

// }
// onMoveData = (evt,ui)=>{

//    if(evt.from.id == evt.to.id){
//        if(evt.willInsertAfter ==true)
//     this.props.handleAttributeDragSort(evt.dragged.id,evt.related.id,"down")
//     else  this.props.handleAttributeDragSort(evt.dragged.id,evt.related.id,"up")

//    }else{
//        if(evt.from.id =="categoryActive"){
//           let task= this.state.active.filter(data=>data.id ==evt.dragged.id)
//           //console.log(task)
//           if(task.length > 0){
//             this.props.handleAttributeDragDrop(task[0]).then(data=>{
//                 this.props.getAllSubAttribute(14).then(()=>{
//                     // alert("ji")
//                     this.getCatgoryData()
//                 })
//             //     this.props.getAllPlantCategories().then(()=>{
//             //     confirmAlert({
//             //     title: 'Action',
//             //     message: 'Successfully Moved from Active to InActive',
//             //     buttons: [
//             //         {
//             //         label: 'Ok'
//             //         }
//             //     ]
//             // });
//             // this.getCatgoryData()
      
//             // })
//         })

//         }

//        }else if(evt.from.id =="categoryInactive"){
//            //console.log(evt.dragged.id,evt.related.id)
//         let task= this.state.inactive.filter(data=>data.id ==evt.dragged.id)
//         //console.log(task)
//         if(task.length > 0){
//             this.props.handleAttributeDragDrop(task[0]).then(data=>{
//                 this.props.getAllSubAttribute(14).then(()=>{
//                     // alert("ji")
//                     this.getCatgoryData()
//                 })
//         //         this.props.getAllPlantCategories().then(()=>{
//         //             this.props.getAllPlantCategories().then(()=>{
//                         // confirmAlert({
//                         //     title: 'Action',
//                         //     message: 'Successfully Moved from InActive to Active',
//                         //     buttons: [
//                         //         {
//                         //         label: 'Ok'
//                         //         }
//                         //     ]
//                         // });
//         //                 this.getCatgoryData()
//         //             })
//         //             // this.getCatgoryData() 
//         //         })
//         //     })

//         // }
        
//        })
//     }

//    }
// }
// }
 ////////////////////////////

        onDelete =(ev)=>{
            let id= this.state.selectedID
            confirmAlert({
                title: 'Delete Bloom Color ',
                message: 'Are you sure want to delete the Bloom Color?',
                buttons: [
                  {
                    label: 'Yes',
                    onClick: () => {this.onDeleteConfirm(id)}
                  },
                  {
                    label: 'No'
                  }
                ]
              });
        }
        onDeleteConfirm=(id)=>{
            let result= this.props.handleAttributeDelete(id)
            this.setState({deleteon:true})
            result.then(res=>{
                this.setState({deleteon:false})
                this.props.getAllSubAttribute(14).then(()=>{
                    // alert("ji")
                    this.getCatgoryData()
                })
                // confirmAlert({
                //     title: 'Delete Successfully',
                //     message: 'Location Type ',
                //     buttons: [
                //       {
                //         label: 'Ok'
                //       }
                //     ]
                //   });
            })
            .catch(data=>{
                this.setState({deleteon:false})

                   confirmAlert({
                   title: 'Alert',
                   message: 'Please note that this item is associated with Plants.Please reassign before deleting ',
                   buttons: [
                     {
                       label: 'Ok'
                     }
                   ]
                 });
           })
        }



        handleZoneInputAction = (e)=>{
            this.setState({
                name:e.target.value
            })

            let errorObj=this.state.errorObj
        if(e.target.name === "bloomColor"){
        errorObj.bloomColor=0
        this.setState({errorObj})}


            this.props.handleZoneInputAction("bloomColor",e.target.value)
        }

        handleAddCategory = (e)=>{
       
            let zoneObj={}
            zoneObj.attribute_id=14
            zoneObj.value = this.props.bloomColor
            zoneObj.status=1
            console.log(zoneObj)


        //     if(this.props.bloomColor){
        //     let result = this.props.handleAddZone(zoneObj)
        //     result.then(res=>{
        //         this.props.getAllSubAttribute(14)
        //     })
        //     alert('Added Successfully Done');
        // }

        // this.setState({
        //     name:""
        // })




        if(this.validate()){
            let result = this.props.handleAddZone(zoneObj)
            result.then(res=>{
                this.props.getAllSubAttribute(14).then(()=>{
                    // alert("ji")
                    this.getCatgoryData()
                })
            })
            // confirmAlert({
            //     title: 'Added Successfully',
            //     message: 'Bloom Color',
            //     buttons: [
            //       {
            //         label: 'Ok'
            //       }
            //     ]
            // });
            this.setState({
                name: "",
                subName:"",
                isEditing:false,
                selectedID:'',
            })
        } 
        
        }



        validate = ()=>{
            let errorObj = this.state.errorObj
            if(this.state.name.length === 0){
                errorObj.bloomColor=1
                this.setState({errorObj})
                return false
            }
           
            return true
            
        }

        handleClear=()=>{
            let errorObj = this.state.errorObj
            errorObj.bloomColor=0
            //errorObj.locationTypeShortCode=0
            this.setState({name: "", subName:"", isEditing:false, selectedID:'', errorObj})
        }


        handleEditClick2 =(t)=> {
            // debugger;  
         this.setState({
             name: t.value,
             isEditing:true,
             selectedID:t.id,
         })
         this.props.handleZoneInputAction("bloomColor",...this.state.name)
        //  this.props.handlePositionInputAction("position",...this.state.name)
         this.props.showSubSubAttribute(t.id)
        //  console.log("ttttttt", t,  this.props.handlePositionInputAction())
       }

       handleAddCategoryUpdate=(e)=>{
        // debugger;
         // this.props.handleSubAttributeUpdate(e.target.id)
         let valueName = this.state.name
         let updateID = parseInt(this.props.showSpeciSubA.id)
         let updateObject={}
         updateObject.value=valueName

         console.log("bloomName",this.props.bloomColor)
        // updateObject.id=this.props.showSpeciSubA.id
            
    //   let res=   this.props.handleSubAttributeUpdate(updateID, updateObject)
    //          res.then(res=>{
    //              this.props.getAllSubAttribute(14)
    //          })

    //          this.setState({
    //              isEditing:false,
    //              name:""
    //          })


             if(this.validate()){
                let res=   this.props.handleSubAttributeUpdate(updateID, updateObject)
                    res.then(res=>{
                        this.props.getAllSubAttribute(14).then(()=>{
                            // alert("ji")
                            this.getCatgoryData()
                        })
                    })
                    if (this.state.isEditing) {
                        // confirmAlert({
                        //     title: 'Updated Successfully',
                        //     message: 'Bloom Color ',
                        //     buttons: [
                        //       {
                        //         label: 'Ok'
                        //       }
                        //     ]
                        // });
                    }
                    this.setState({
                        isEditing:false,
                        name:"",
                        subName:""
                    })
            }

     }




        render() {
        return (
           
               <div>
               <div className="bg-white">
                            <h4 className="p-15 mb-0">Bloom & Foilage Colors</h4>
                            <hr className="m-0"/>
                            <div className="ContentSection p-15">
                                <div className="row">
                                    <div className="col-md-12 col-lg-12">
                                        <p>Color Name</p>
                                        <div className="row d-flex align-items-center">
                                            <div className="col-md-6 col-lg-6">  
                                                <input type="text" 
                                                className={this.state.isEditing===false ? "form-control" : "form-control" } style={{backgroundColor:this.state.isEditing===false?"white":"#d5ecf5"}}
                                                 name="bloomColor" 
                                                 value={this.state.name}
                                                  placeholder="Color"
                                                 onChange={this.handleZoneInputAction}/>
                                                  {this.state.errorObj.bloomColor!==0?<span style={{fontSize:"small",color:"red"}}>Enter Color Name</span>:""}
                                            </div>


                                            {/* <div className="col-md-6 col-lg-3" onClick={this.handleAddCategory}>
                                                <a href="javascript:" className="d-flex align-items-center">
                                                    <i className="fa fa-plus-circle fa-2x mr-2"></i> Add New Color
                                                </a>style={{display:"flex"}} style={{marginLeft:"6em", marginTop:"1em"}}
                                            </div> */}



                                            {/* {this.state.isEditing ? (
                                                    <div className="col-md-6 col-lg-3" onClick={this.handleAddCategoryUpdate}>
                                                        <div  >
                                                            <a href="javascript:" className="d-flex align-items-center">
                                                                <i className="fa fa-plus-circle fa-2x mr-2"></i> Update Color
                                                            </a>
                                                        </div>

                                                            <div className="col-md-6 col-lg-3"  onClick={()=>{this.setState({isEditing:false})}}>
                                                                <a href="javascript:" className="d-flex align-items-center cancel_signlebox">
                                                                    Cancel 
                                                                </a>
                                                            </div>
                                                    </div>

                                                        ):
                                                        (
                                                        <div className="col-md-6 col-lg-3" onClick={this.handleAddCategory}>
                                                        <a href="javascript:" className="d-flex align-items-center">
                                                        <i className="fa fa-plus-circle fa-2x mr-2"></i> Add New Color
                                                        </a>
                                                        </div>  
                                            )}         */}

                            <div className="d-flex justify-content-md-end mt-2" >
                                <div >
                                    <a href="javascript:" className="d-flex align-items-center" onClick={this.state.isEditing ? this.handleAddCategoryUpdate : this.handleAddCategory}> 
                                        <i className="fa fa-plus-circle fa-2x mr-2"></i> {this.state.isEditing ? this.state.btnLabelUpdate : this.state.btnLabelAdd }
                                    </a>
                                </div>
                                <div className="d-flex justify-content-md-end mt-2"  onClick={this.handleClear}>
                                    <a href="javascript:" className="d-flex align-items-center" style={{marginLeft:"2.5em", marginTop:"-6px"}}>
                                        <i className="fa fa-times-circle fa-2x mr-2"></i> {this.state.btnLabelCancel} 
                                    </a>
                                </div>
                            </div>


                                        </div>
                                    </div>
                                </div>
                                <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} removeItem={this.removeItem}>
                        <div style={{display: 'flex',paddingTop:20}}>
                       
                            <div style={{flex:5}}>
                                <div class="card midCard">
                                    <div class="card-header">
                                        Inactive
                                    </div>


                                    {!this.state.loading?  <div style={{height: "300px",lineHeight: "300px",textAlign: "center",backgroundColor:"#F0F0F0"}}><Loader/></div>:<div class="card-body cardBg" >
                                   <ul class="list-unstyled" id="categoryActive">
                                    <Droppable droppableId="droppable2">
                                        {(provided, snapshot) => (
                                            <div  style={{height:this.state.inactive.length>5?"auto":265}} 
                                                ref={provided.innerRef}
                                            >
                                                {this.state.inactive.map((item, index) => (
                                                    <Draggable
                                                        key={item.id.toString()}
                                                        draggableId={item.id.toString()}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                            style={{position:"relative"}}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                >
                                                                <li id={item.id.toString()}>
                                                        <div class="showElipse">
                                                        <div className={this.state.isEditing===false  ? "a" :this.state.selectedID === item.id ? "reasonBackground a" : "a"}><span id={item.id}    >{item.value}</span>
                                                        
                                                        </div>
                                                        <span style={{float:"right",fontSize:20, cursor:"pointer", color:"#629c44",marginTop:"-28px"}}  id={item.id}><MdIcons.MdEdit  
                                                                onClick={() =>this.handleEditClick2(item)}
                                                                /></span>
                                                        </div>
                                                   
                                                                 {/* <a className="d-flex justify-content-between align-items-center"  id={t.id}>
                                                                      <span id={t.id}   className={this.state.isEditing===false  ? "" :this.state.selectedID === t.id ? "reasonBackground eplisData " : "eplisData"} >{t.name}</span>

                                                                      <span style={{float:"right",fontSize:20, cursor:"pointer", color:"#629c44"}}  id={t.id}><MdIcons.MdEdit  
                                                                onClick={() =>this.handleEditClick2(t)}
                                                                /></span>
                                                                 </a> */}
                                                            </li>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                            {/* {this.state.active.map(t=>{
                                            return (<li></li>)
                                            })} */}
                                    </ul>
                                        


                                    </div>}
                                </div>
                            </div>
                            <div style={{flex:1,paddingLeft:5,paddingRight:5}}>
                            <div className="midControls d-flex flex-column justify-content-around">
                                            <div>
                                            <i class="fas fa-angle-double-right" style={{fontSize:40,color:"gray"}}></i>
                                                <p style={{fontSize:"14px",fontWeight:"bold",color:"gray",textAlign:"center"}}>Drag & Drop to Place</p>
                                               
                                            </div>
                                            <div>
                                            <i class="fas fa-arrows-alt" style={{fontSize:40,color:"gray"}}></i>
                                                <p style={{fontSize:"14px",fontWeight:"bold",color:"gray",textAlign:"center"}}>Drag To Sort</p>
                                                
                                            </div> 
                                            <Droppable
                                                       
                                            droppableId="delete">
                                                     
                                               
                                             {(provided, snapshot) => (
                                            <div    style={{maxWidth:165,height:100,width:165}}
                                                ref={provided.innerRef}
                                            >
                                              
                                                    <Draggable
                                                        key="delete"
                                                        draggableId="delete"
                                                       
                                                        index={0}>
                                                        {(provided, snapshot) => (
                                                            <div   
                                                            ref={provided.innerRef}>
                                                        
                                                                
                                                                <div className="deleteSpace"   style={{height:"70px"}}>
                                                <i className ={`fa fa-trash ${this.state.deleteon===true?"trashShake":""}`}style={{fontSize:35,color:"red"}} ></i>
                                                <p style={{fontSize:"14px",fontWeight:"bold",color:"gray",textAlign:"center"}}>Drag & Drop Here to Remove</p>
                                                {/* <img style={{width:"5em"}} src="./assets/img/Genral_Icons/Drag _Drop_remove_red.png" alt="Settings" className="trashShake"/> */}
                                            </div>
                                                                
                                                 
                                                            </div>
                                                        )}
                                                    </Draggable>
                                             
                                                {provided.placeholder}
                                            </div>
                                        )}
                                            </Droppable>

                                            
                                        </div>
                            </div>
                           
                                    
                                    {/* </div> */}
                            <div style={{flex:5}}>
                                <div class="card midCard">
                                    <div class="card-header">
                                        Active
                                    </div>
                                    {!this.state.loading?  <div style={{height: "300px",lineHeight: "300px",textAlign: "center",backgroundColor:"#F0F0F0"}}><Loader/></div>:<div class="card-body cardBg" >
                                    <ul class="list-unstyled" id="categoryActive">
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) => (
                                            <div    style={{height:this.state.active.length>5?"auto":265}}  
                                                ref={provided.innerRef}
                                            >
                                                {this.state.active.map((item, index) => (
                                                    <Draggable
                                                        key={item.id.toString()}
                                                        draggableId={item.id.toString()}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                            style={{height:100,border:"1px solid red"}}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                >
                                                                <li id={item.id.toString()}>
                                                        <div class="showElipse">
                                                        <div className={this.state.isEditing===false  ? "a" :this.state.selectedID === item.id ? "reasonBackground a" : "a"}><span id={item.id}    >{item.value}</span>
                                                        
                                                        </div>
                                                        <span style={{float:"right",fontSize:20, cursor:"pointer", color:"#629c44",marginTop:"-28px"}}  id={item.id}><MdIcons.MdEdit  
                                                                onClick={() =>this.handleEditClick2(item)}
                                                                /></span>
                                                        </div>
                                                   
                                                                 {/* <a className="d-flex justify-content-between align-items-center"  id={t.id}>
                                                                      <span id={t.id}   className={this.state.isEditing===false  ? "" :this.state.selectedID === t.id ? "reasonBackground eplisData " : "eplisData"} >{t.name}</span>

                                                                      <span style={{float:"right",fontSize:20, cursor:"pointer", color:"#629c44"}}  id={t.id}><MdIcons.MdEdit  
                                                                onClick={() =>this.handleEditClick2(t)}
                                                                /></span>
                                                                 </a> */}
                                                            </li>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                            {/* {this.state.active.map(t=>{
                                            return (<li></li>)
                                            })} */}
                                    </ul>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        
                    
                    </DragDropContext>
                            </div>
                        </div>
        </div>
       
        )
    }
}

     const mapStateToProps = (state)=> (
        // console.log(state)
         {
        
   zoneCategoryList:state.attributeData.subAttribute,
    temp:state,
    // name:state.categoryData.name
    bloomColor:state.attributeData.subAttributeName.bloomColor,
    showSpeciSubA: state.attributeData.specificSubAttribute,
    }
    )
    export default connect(mapStateToProps,{
        getAllSubAttribute,
        handleAttributeDragDrop,
        handleAttributeDragSort,
        handleAttributeDelete,
        handleZoneInputAction,
        handleAddZone ,
        showSubSubAttribute,
        handleSubAttributeUpdate     
    })(BloomFoliageColors)
