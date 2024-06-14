import { useState, useRef, useEffect } from 'react';
import { Map, MapApiLoaderHOC, Marker, ScaleControl } from 'react-bmapgl';

import FullModal from '../../modal/FullModal';
import './MemoryMap.css';

function MemoryMap() {
    const [markerList, setMarkerList] = useState([
        {
            lng: 116.31088, lat: 39.99281, name: '北京大学', description: "这里是北京大学", images: [
                "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
                "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
                "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
                "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
            ]
        },
        { lng: 116.326836, lat: 40.00366, name: '清华大学', description: "这里是清华大学", images: [] },
        { lng: 121.503971, lat: 31.29686, name: '复旦大学', description: "这里是复旦大学", images: [] },
    ]);
    const mapRef = useRef(null);
    const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
    const [centeredMarkerIndex, setCenteredMarkerIndex] = useState(null);
    const [centeredMarker, setCenteredMarker] = useState(null);

    const [createMarkerBtnActive, setCreateMarkerBtnActive] = useState(false);

    useEffect(() => {
        // after the marker is added, save the list to local storage
        if (createMarkerBtnActive) {
            localStorage.setItem('memoryMapMarkerList', JSON.stringify({ "markers": markerList }));

            // automataically navigate and open the memory modal after 500ms for user to initialize the new marker
            mapRef.map.flyTo({ lng: markerList[markerList.length - 1].lng, lat: markerList[markerList.length - 1].lat }, 15);
            setCenteredMarkerIndex(markerList.length - 1);
            setCenteredMarker(markerList[markerList.length - 1]);
            setTimeout(() => {
                setIsMemoryModalOpen(true);
            }, 500);

            setCreateMarkerBtnActive(false);
        }
    }, [markerList]);

    const onMapClick = (e) => {
        if (createMarkerBtnActive) {
            // add a new marker to the map when the create marker button is active
            const newMarker = { lng: e.latlng.lng, lat: e.latlng.lat, name: "", description: "", images: [] };
            setMarkerList(prev => [
                ...prev,
                newMarker
            ]);
        }
    }

    const onMarkerClick = (lng, lat, index) => {
        if (centeredMarkerIndex === index) {
            // if the clicked marker is already centered, open the memory modal
            setIsMemoryModalOpen(true);
        } else {
            // fly to the clicked marker with zoom level 15
            mapRef.map.flyTo({ lng, lat }, 15);
        }
        setCenteredMarkerIndex(index);
        setCenteredMarker(markerList[index]);
    }

    return (
        <>
            <div className={`memory-map-marker-create ${createMarkerBtnActive ? 'active' : ''}`} 
                onClick={() => { setCreateMarkerBtnActive(!createMarkerBtnActive) }}
            >
                <i className="ri-map-pin-add-line"></i>
            </div>
            <FullModal isOpen={isMemoryModalOpen} onClose={() => { setIsMemoryModalOpen(false); }}>
                {centeredMarkerIndex !== null && centeredMarker &&
                    <>
                        <input className='memory-map-memory-modal-title' value={centeredMarker.name}
                            placeholder='Title'
                            onChange={(e) => {
                                // update the title of the clicked marker
                                setMarkerList(prev => {
                                    const newMarkerList = [...prev];
                                    newMarkerList[centeredMarkerIndex].name = e.target.value;
                                    return newMarkerList;
                                })
                                setCenteredMarker({ ...centeredMarker, name: e.target.value });
                            }}
                        >
                        </input>
                        <div className='memory-map-memory-modal-content-container'>
                            <textarea className='memory-modal-description'
                                placeholder='Description'
                                value={centeredMarker.description}
                                onChange={(e) => {
                                    if (e.target.scrollHeight >= e.target.offsetHeight) {
                                        e.target.style.height = e.target.scrollHeight + "px";
                                    }
                                    // update the description of the clicked marker
                                    setMarkerList(prev => {
                                        const newMarkerList = [...prev];
                                        newMarkerList[centeredMarkerIndex].description = e.target.value;
                                        return newMarkerList;
                                    })
                                    setCenteredMarker({ ...centeredMarker, description: e.target.value });
                                }}
                            >
                            </textarea>
                            <div className='memory-modal-images-container'>
                                {markerList[centeredMarkerIndex].images && markerList[centeredMarkerIndex].images.map((image, index) => {
                                    return (
                                        <img key={index} src={image} />
                                    )
                                })}
                                <div className='memory-modal-add-image-btn'>
                                    <i className='ri-image-add-fill'></i>
                                    <input type="file" accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            const reader = new FileReader();
                                            reader.readAsDataURL(file);
                                            reader.onload = () => {
                                                // add the new image to the clicked marker
                                                setMarkerList(prev => {
                                                    const newMarkerList = [...prev];
                                                    newMarkerList[centeredMarkerIndex].images = [
                                                        ...newMarkerList[centeredMarkerIndex].images,
                                                        reader.result
                                                    ];
                                                    return newMarkerList;
                                                })
                                            }
                                        }}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </FullModal>
            <div className='memory-map-container' id="memory-map-container">
                <Map zoom="10" style={{ height: '100%', width: '100%' }} ref={ref => { mapRef.map = ref?.map }}
                    center={{ lng: 116.402544, lat: 39.928216 }}
                    enableScrollWheelZoom // enable scroll wheel zooming
                    enableDragging // enable dragging the map
                    onClick={onMapClick}
                >
                    {/* Enable the scale control */}
                    <ScaleControl />
                    {/* Add markers to the map */}
                    {markerList && markerList.map((marker, index) => {
                        return (
                            <Marker key={index} icon={"loc_red"}
                                position={{ lng: marker.lng, lat: marker.lat }}
                                onClick={() => onMarkerClick(marker.lng, marker.lat, index)}
                            />
                        )
                    })}
                </Map>
            </div>
        </>
    )
}

export default MapApiLoaderHOC({ ak: process.env.REACT_APP_BAIDU_AK })(MemoryMap);