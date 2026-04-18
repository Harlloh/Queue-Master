import { useState } from "react";
import AdminCard from "./adminCard";
import Input from "./inputField";
import Label from "./label";
import { MdMyLocation, MdSave, MdSettings } from "react-icons/md";
import { useAuth } from "../store/authStore";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Feedback from "./toast";

function AdminSystemCOnfigScreen() {
    const { setAdmin, setIsAuthenticated, admin } = useAuth()
    const navigate = useNavigate()


    const [configLga, setConfigLga] = useState<string | undefined>(admin?.lgaDetails?.name);
    const [lat, setLat] = useState<number | undefined>(admin?.lgaDetails?.latitude);
    const [lng, setLng] = useState<number | undefined>(admin?.lgaDetails?.longitude);
    const [radius, setRadius] = useState<number | undefined>(admin?.lgaDetails?.radius);
    const [configMsg, setConfigMsg] = useState("");
    const [configError, setConfigError] = useState("");
    const [isLocation, setLocationGotten] = useState<Boolean>(false);
    const [gettingLocation, setGettingLocation] = useState(false);



    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setConfigError("'Location permission required. Allow permission and refresh the page'");
            return
        };
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(parseFloat(pos.coords.latitude.toFixed(6)));
                setLng(parseFloat(pos.coords.longitude.toFixed(6)));
                setLocationGotten(true)
                setGettingLocation(false);
                setTimeout(() => setLocationGotten(false), 5000);
            },
            (error) => {
                setGettingLocation(false);
                setConfigError("'Location permission denied. Allow permission and refresh the page'");
                console.log('Error getting location: ', error);
            }
        );
        setGettingLocation(true);
    };

    const saveConfig = async () => {
        setConfigError("");
        setConfigMsg("");
        const r = (radius);
        if (configLga && !configLga.trim() || !lat || !lng) {
            setConfigError("All fields are required.");
            return;
        }
        if (r! < 50 || r! > 1000) {
            setConfigError("Radius must be between 50 m and 1000 m.");
            return;
        }
        setTimeout(() => {
            setConfigMsg("Location settings saved successfully.");
        }, 5000);

        const payload = {
            radius: radius,
            latitude: lat,
            longitude: lng,
            name: configLga
        }
        console.log(payload)
        try {
            const res = await api.post('/admin/update-lga', payload)
            console.log(res.data);
            if (res.data.success) {
                const lga = res.data.lga;
                setAdmin({
                    ...admin!, // spread existing admin fields (id, name, email)
                    lgaDetails: {
                        name: lga.name,
                        latitude: lga.latitude,
                        longitude: lga.longitude,
                        radius: lga.radius,
                        updatedAt: lga.updatedAt,
                    }
                });
            }
        } catch (error) {
            setTimeout(() => {
                setConfigError("Failed to save location settings. Please try again.");
            }, 5000);
            console.error(error);
        }
    };


    return (
        <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
            <AdminCard
                icon={<MdSettings className="text-lg" />}
                title="System Configuration"
                subtitle="Set the LGA's geofence — corpers outside this radius cannot check in."
            >
                <div className="flex flex-col gap-3">
                    <div>
                        <Label>LGA Name</Label>
                        <Input
                            placeholder="e.g. Ikeja"
                            value={configLga}
                            onChange={(e) => setConfigLga(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Latitude</Label>
                            <Input
                                placeholder="e.g. 6.6018"
                                value={lat}
                                onChange={(e) => setLat(parseFloat(e.target.value))}
                                disabled
                            />
                        </div>
                        <div>
                            <Label>Longitude</Label>
                            <Input
                                placeholder="e.g. 3.3515"
                                value={lng}
                                onChange={(e) => setLng(parseFloat(e.target.value))}
                                disabled
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Geofence Radius (meters)</Label>
                        <Input
                            type="number"
                            min={50}
                            max={1000}
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Between 50 m and 1000 m</p>
                    </div>

                    {configError && <Feedback type="error" message={configError} />}
                    {configMsg && <Feedback type="success" message={configMsg} />}
                    {isLocation && <Feedback type="success" message={"Location gotten successfully"} />}

                    <button
                        onClick={useCurrentLocation}
                        disabled={gettingLocation}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-semibold hover:bg-slate-50 active:scale-[0.98] transition"
                    >
                        {!gettingLocation && <MdMyLocation className="text-[#2b7234] text-base" />} {gettingLocation ? 'Please wait...' : lat && lng ? 'Update Location' : 'Get Location'}
                    </button>

                    <button
                        onClick={saveConfig}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2b7234] hover:bg-[#153619] text-white text-sm font-bold transition-all active:scale-[0.98]"
                    >
                        <MdSave className="text-base" /> Save Settings
                    </button>
                </div>
            </AdminCard>
        </main>

    );
}

export default AdminSystemCOnfigScreen;