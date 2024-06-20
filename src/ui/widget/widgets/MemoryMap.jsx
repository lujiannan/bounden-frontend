import { useState, useRef, useEffect, useContext } from 'react';
import { Map, MapApiLoaderHOC, Marker, ScaleControl } from 'react-bmapgl';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; // for getting the logged in user's email
import { useNavigate } from 'react-router-dom'
import { MemoryMapContext } from './MemoryMapContext'

import FullModal from '../../modal/FullModal';
import ImageModal from '../../modal/ImageModal';
import './MemoryMap.css';

function MemoryMap() {
    const { markerList, setMarkerList } = useContext(MemoryMapContext);

    const auth = useAuthUser();
    const user_email = auth?.email;
    const URL_SUFFIX_CREATE = '/memory_map_markers/create';
    const URL_SUFFIX_UPDATE = '/memory_map_markers/edit';
    const URL_SUFFIX_DELETE = '/memory_map_markers/delete';
    const URL_SUFFIX_ALL = '/memory_map_markers/' + user_email;
    const URL_SUFFIX_IMAGE_UPLOAD = "/images/upload";

    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    const mapRef = useRef(null);
    const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
    const [isMemoryModalChanged, setIsMemoryModalChanged] = useState(false);
    const [centeredMarkerIndex, setCenteredMarkerIndex] = useState(null);
    const [centeredMarker, setCenteredMarker] = useState(null);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageModalImageURL, setImageModalImageURL] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [createMarkerBtnActive, setCreateMarkerBtnActive] = useState(false);

    useEffect(() => {
        // set the user current location on the map
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    mapRef.map.flyTo({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }, 15);
                    localStorage.setItem("memoryMapCenter", JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude }));
                },
                (err) => {
                    console.log(err.message);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        // load the marker list from backend if the marker list in the provider context is empty
        if (markerList.length === 0 && isAuthenticated) {
            // load the marker list from backend
            setIsLoading(true);
            fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_ALL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // get access token from local storage
                    "Authorization": "Bearer " + localStorage.getItem("_auth"),
                },
            })
                .then((res) => {
                    if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                    return res.json();
                })
                .then((data) => {
                    const transformedMarkers = data.markers.map(marker => ({
                        ...marker,
                        images: marker.images ? marker.images.split(",") : [], // transform images from string into an array
                    }));
                    setMarkerList(transformedMarkers);
                    setIsLoading(false);
                })
                .catch(error => {
                    setIsLoading(false);
                    console.log(error.message);
                    // alert(fetchError);
                });
        } else if (markerList.length > 0) {
            if (!isAuthenticated) {
                // if the user is not authenticated, erase the marker list
                setMarkerList([]);
            }
        }
    }, []);

    const submitMarker = (newMarker = null) => {
        let body_data;
        if (newMarker) {
            body_data = JSON.stringify({
                "user_email": user_email,
                "latitude": newMarker.latitude,
                "longitude": newMarker.longitude,
            });
        } else {
            body_data = JSON.stringify({
                "user_email": user_email,
                "id": centeredMarker.id,
                "latitude": centeredMarker.latitude,
                "longitude": centeredMarker.longitude,
                "name": centeredMarker.name,
                "description": centeredMarker.description,
                "images": centeredMarker.images.toString(),
            });
        }
        // save the marker list to the server
        const urlSuffix = newMarker ? URL_SUFFIX_CREATE : URL_SUFFIX_UPDATE;
        fetch(process.env.REACT_APP_SERVER_URL + urlSuffix, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: body_data,
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                console.log("marker post");
                setIsLoading(false);
                return res.json();
            })
            .then((data) => {
                if (data.message === "Marker created successfully") {
                    data.marker.images = [];
                    setMarkerList(prev => [
                        ...prev,
                        data.marker,
                    ]);
                } else if (data.message === "Marker updated successfully") {
                    data.marker.images = data.marker.images ? data.marker.images.split(",") : [];
                    setMarkerList(prev => {
                        const newMarkerList = [...prev];
                        newMarkerList[centeredMarkerIndex] = data.marker;
                        return newMarkerList;
                    });
                }
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error.message)
                // alert(fetchError);
            });
    }

    useEffect(() => {
        // after the marker is added, save the list to local storage
        if (createMarkerBtnActive) {
            // automataically navigate and open the memory modal after 500ms for user to initialize the new marker
            mapRef.map.flyTo({ lng: markerList[markerList.length - 1].longitude, lat: markerList[markerList.length - 1].latitude }, 15);
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
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }
            // add a new marker to the map when the create marker button is active
            const newMarker = { id: null, longitude: e.latlng.lng, latitude: e.latlng.lat, name: "", description: "", images: [] };

            setIsLoading(true);
            submitMarker(newMarker);
        }
    }

    const onMarkerClick = (longitude, latitude, index) => {
        if (centeredMarkerIndex === index) {
            // if the clicked marker is already centered, open the memory modal
            setIsMemoryModalOpen(true);
        } else {
            // fly to the clicked marker with zoom level 15
            mapRef.map.flyTo({ lng: longitude, lat: latitude }, 15);
        }
        setCenteredMarkerIndex(index);
        setCenteredMarker(markerList[index]);
    }

    const onMemoryModalCloseSave = () => {
        setIsMemoryModalOpen(false);
        if (isMemoryModalChanged) {
            setIsLoading(true);
            submitMarker();
            setIsMemoryModalChanged(false);
        }
    }

    const handleImageUpload = (file) => {
        setIsImageUploading(true);
        // upload the image to the server, insert the image into the editor and show the upload status under the editor
        const form_data = new FormData();
        form_data.append("user_email", user_email);
        form_data.append("name", file.name);
        form_data.append("file", file);

        fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_IMAGE_UPLOAD, {
            method: "POST",
            headers: {
                // Content-Type is not required for FormData, cuz browser will set it automatically
                // "Content-Type": "application/form-data",
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: form_data,
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                setIsImageUploading(false);
                return res.json();
            })
            .then((data) => {
                // do sth here after the image is uploaded
                if (data.message === "Image uploaded successfully") {
                    setCenteredMarker({ ...centeredMarker, images: [...centeredMarker.images, data.url] });
                } else {
                    console.log(data.message);
                }
            })
            .catch(error => {
                setIsImageUploading(false);
                console.log(error.message)
                // alert(fetchError);
            });
    }

    const onCenteredMarkerDelete = () => {
        // delete the clicked marker from the server and the marker list in the provider context
        setIsMemoryModalOpen(false);
        setIsLoading(true);
        const body_data = JSON.stringify({
            "user_email": user_email,
            "id": centeredMarker.id,
        });
        fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_DELETE, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: body_data,
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                console.log("marker delete");
                setIsLoading(false);
                return res.json();
            })
            .then((data) => {
                if (data.message === "1 row(s) deleted") {
                    // remove the deleted marker from the marker list in the provider context
                    setMarkerList(prev => prev.filter(marker => marker.id !== data.id));
                    // setCenteredMarkerIndex(null);
                    // setCenteredMarker(null);
                }
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error.message)
                // alert(fetchError);
            });
    }

    return (
        <>
            <div className={`memory-map-loading-container ${isLoading ? 'active' : ''}`}>
                <div className='memory-map-loading-text'>
                    Loading
                    <div className='memory-map-loading-pulse'>
                        <div className='loading-pulse'></div>
                    </div>
                </div>
            </div>
            <div className={`memory-map-marker-create ${createMarkerBtnActive ? 'active' : ''}`}
                onClick={() => { setCreateMarkerBtnActive(!createMarkerBtnActive) }}
                title='Place a marker on the map'
            >
                <i className="ri-map-pin-add-line"></i>
            </div>
            <ImageModal isOpen={isImageModalOpen} onClose={() => { setIsImageModalOpen(false); }} >
                <img src={imageModalImageURL} />
            </ImageModal>
            <FullModal isOpen={isMemoryModalOpen} onClose={() => { onMemoryModalCloseSave(); }}>
                {centeredMarkerIndex !== null && centeredMarker &&
                    <>
                        <input className='memory-map-memory-modal-title' value={centeredMarker.name}
                            placeholder='Title'
                            onChange={(e) => {
                                setIsMemoryModalChanged(true);
                                // update the title of the clicked marker
                                setCenteredMarker({ ...centeredMarker, name: e.target.value });
                            }}
                        >
                        </input>
                        <div className='memory-map-memory-modal-content-container'>
                            <textarea className='memory-modal-description'
                                placeholder='Description'
                                value={centeredMarker.description}
                                onChange={(e) => {
                                    setIsMemoryModalChanged(true);
                                    if (e.target.scrollHeight >= e.target.offsetHeight) {
                                        e.target.style.height = e.target.scrollHeight + "px";
                                    }
                                    setCenteredMarker({ ...centeredMarker, description: e.target.value });
                                }}
                            >
                            </textarea>
                            <div className='memory-modal-images-container'>
                                {centeredMarker.images && centeredMarker.images.map((image, index) => {
                                    return (
                                        <div className='memory-modal-image-container' key={index}>
                                            <img src={image}
                                                onClick={() => {
                                                    setIsImageModalOpen(true);
                                                    setImageModalImageURL(image);
                                                }} />
                                            <div className='memory-modal-image-remove-btn'
                                                onClick={() => {
                                                    setIsMemoryModalChanged(true);
                                                    // remove the clicked image from the centered marker
                                                    setCenteredMarker({ ...centeredMarker, images: centeredMarker.images.filter((img, imgIndex) => imgIndex !== index) });
                                                }}>
                                                <i className='ri-delete-bin-line' />
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className='memory-modal-add-image-btn'>
                                    {isImageUploading ?
                                        <div className='memory-modal-add-image-loading-container'>
                                            <div className='loading-pulse'></div>
                                        </div> :
                                        <>
                                            <i className='ri-image-add-fill'></i>
                                            <input type="file" accept="image/*"
                                                onChange={(e) => {
                                                    setIsMemoryModalChanged(true);
                                                    // add a new image to the clicked marker
                                                    const file = e.target.files[0];
                                                    handleImageUpload(file);
                                                }}
                                            ></input>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='memory-map-memory-modal-toolbar'>
                            <div className='memory-map-modal-toolbar-btn reset' title='Reset' onClick={() => {
                                setCenteredMarker(markerList[centeredMarkerIndex]);
                            }}>
                                <i className='ri-refresh-line' />
                            </div>
                            <div className='memory-map-modal-toolbar-btn delete' title='Delete' onClick={() => {
                                onCenteredMarkerDelete();
                            }}>
                                <i className='ri-delete-bin-6-line' />
                            </div>
                        </div>
                    </>
                }
            </FullModal>
            <div className='memory-map-container' id="memory-map-container">
                <Map zoom="15" style={{ height: '100%', width: '100%' }} ref={ref => { mapRef.map = ref?.map }}
                    center={localStorage.getItem("memoryMapCenter") ? 
                        JSON.parse(localStorage.getItem("memoryMapCenter")) : 
                        { lng: 121.499809, lat: 31.239666 }
                    }
                    enableScrollWheelZoom // enable scroll wheel zooming
                    enableDragging // enable dragging the map
                    onClick={onMapClick}
                >
                    {/* Enable the scale control */}
                    <ScaleControl />
                    {/* Add markers to the map */}
                    {markerList && markerList.length > 0 && markerList.map((marker, index) => {
                        return (
                            <Marker key={index} icon={"loc_red"}
                                position={{ lng: marker.longitude, lat: marker.latitude }}
                                onClick={() => { onMarkerClick(marker.longitude, marker.latitude, index); }}
                            />
                        )
                    })}
                </Map>
            </div>
        </>
    )
}

export default MapApiLoaderHOC({ ak: process.env.REACT_APP_BAIDU_AK })(MemoryMap);