"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building,
  Plus,
  AlertTriangle,
  Users,
  Activity,
  TrendingUp,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Share2,
  Search,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  createAlert,
  getAlertResponseStats,
  getAlerts,
} from "@/lib/actions/alerts.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { formatLastActivity } from "@/lib/utils";

type Donor = {
  id: number;
  alertId: number;
  donorName: string;
  bloodType: string;
  distance: string;
  phone: string;
  status: string;
  eta: string;
  lastDonation: string;
};

export default function HospitalDashboard() {
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");

  const [donorResponses, setDonorResponses] = useState<DonorUI[]>([
    {
      id: "1",
      donorName: "Arjun Roy",
      bloodType: "O+",
      distance: "2.3 km",
      phone: "+91-98300-12345",
      status: "Confirmed",
      eta: "30 minutes",
      lastDonation: "3 months ago",
    },
    {
      id: "2",
      donorName: "Priya Sen",
      bloodType: "A-",
      distance: "1.8 km",
      phone: "+91-98045-67890",
      status: "Pending",
      eta: "25 minutes",
      lastDonation: "4 months ago",
    },
    {
      id: "3",
      donorName: "Ritwik Chatterjee",
      bloodType: "B+",
      distance: "5.8 km",
      phone: "+91-98765-43210",
      status: "Confirmed",
      eta: "65 minutes",
      lastDonation: "5 months ago",
    },
    {
      id: "4",
      donorName: "Sohini Dutta",
      bloodType: "B-",
      distance: "6.3 km",
      phone: "+91-97481-55678",
      status: "Pending",
      eta: "70 minutes",
      lastDonation: "6 months ago",
    },
    {
      id: "5",
      donorName: "Aniket Mukherjee",
      bloodType: "AB+",
      distance: "5.0 km",
      phone: "+91-98312-33445",
      status: "Confirmed",
      eta: "60 minutes",
      lastDonation: "2 months ago",
    },
    {
      id: "6",
      donorName: "Moumita Ghosh",
      bloodType: "AB-",
      distance: "6.8 km",
      phone: "+91-99030-66789",
      status: "Pending",
      eta: "75 minutes",
      lastDonation: "7 months ago",
    },
    {
      id: "7",
      donorName: "Sayan Banerjee",
      bloodType: "A+",
      distance: "3.4 km",
      phone: "+91-89670-44556",
      status: "Confirmed",
      eta: "40 minutes",
      lastDonation: "1 month ago",
    },
    {
      id: "8",
      donorName: "Debanjan Saha",
      bloodType: "O-",
      distance: "29 km",
      phone: "+91-97480-11223",
      status: "Pending",
      eta: "95 minutes",
      lastDonation: "8 months ago",
    },
    {
      id: "9",
      donorName: "Shreya Basu",
      bloodType: "A-",
      distance: "1.6 km",
      phone: "+91-98311-88990",
      status: "Confirmed",
      eta: "22 minutes",
      lastDonation: "6 months ago",
    },
    {
      id: "10",
      donorName: "Subhajit Paul",
      bloodType: "B+",
      distance: "23.0 km",
      phone: "+91-99039-77441",
      status: "Pending",
      eta: "70 minutes",
      lastDonation: "5 months ago",
    },
  ]);

  const [bloodInventory, setBloodInventory] = useState([
    { type: "A+", current: 15, minimum: 20 },
    { type: "A-", current: 8, minimum: 10 },
    { type: "B+", current: 25, minimum: 15 },
    { type: "B-", current: 5, minimum: 8 },
    { type: "AB+", current: 12, minimum: 10 },
    { type: "AB-", current: 3, minimum: 5 },
    { type: "O+", current: 8, minimum: 25 },
    { type: "O-", current: 6, minimum: 15 },
  ]);

  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  type AlertWithType = Alerts & { type?: AlertType | string };

  const [activeAlerts, setActiveAlerts] = useState<AlertWithType[]>([]);
  // const [donorResponses, setDonorResponses] = useState<DonorUI[]>([]);
  const [currentAlert, setCurrentAlert] = useState<AlertWithType | null>(null);

  // useEffect(() => {
  //   if (activeAlerts.length > 0 && !currentAlert) {
  //     setCurrentAlert(activeAlerts[0]);
  //   }
  // }, [activeAlerts, currentAlert]);

  // useEffect(() => {
  //   async function fetchResponses() {
  //     if (!currentAlert) return;

  //     const stats = await getAlertResponseStats(currentAlert.id);
  //     setDonorResponses(stats.donorResponses); // full list
  //     setActiveAlerts((prev) =>
  //       prev.map((alert) =>
  //         alert.id === currentAlert.id
  //           ? {
  //               ...alert,
  //               responses: stats.responses,
  //               confirmed: stats.confirmed,
  //             }
  //           : alert
  //       )
  //     );
  //   }
  //   if (currentAlert?.id) fetchResponses();
  // }, [currentAlert]);

  // put this near the top of your component file (outside useEffect)
  const mockPlasmaAlerts: AlertWithType[] = [
    {
      id: "mock-plasma-1",
      type: "Plasma",
      bloodType: null,
      urgency: "CRITICAL",
      unitsNeeded: "3",
      radius: "10",
      description: "Urgent plasma required for surgery",
      hospitalId: "mock-hospital",
      createdAt: formatLastActivity(new Date(), false),
      responses: 0,
      confirmed: 0,
    },
    {
      id: "mock-plasma-2",
      type: "Plasma",
      bloodType: null,
      urgency: "CRITICAL",
      unitsNeeded: "2",
      radius: "15",
      description: "Plasma donation needed for patient recovery",
      hospitalId: "mock-hospital",
      createdAt: formatLastActivity(new Date(), false),
      responses: 0,
      confirmed: 0,
    },
  ];

  const [newAlert, setNewAlert] = useState({
    type: "",
    bloodType: "",
    urgency: "",
    unitsNeeded: "",
    description: "",
    radius: "10",
  });
  const router = useRouter();

  const [dbUser, setDbUser] = useState<any>(null);

  const [user, setUser] = useState<HospitalData | null>(null);

  const { user: loggedInUser } = useUser();
  const [hospitalID, setHospitalID] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const email = loggedInUser?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        const res = await getCurrentUser(email);
        console.log("[Dashboard] server action response:", res);
        setDbUser(res);
      } catch (err) {
        console.error("[Dashboard] error calling getCurrentUser:", err);
      }
    };

    fetchUser();
  }, [loggedInUser]);

  useEffect(() => {
    if (dbUser?.role === "HOSPITAL" && dbUser.user) {
      console.log("[Dashboard] user is a hospital:", dbUser.user.id);
      setHospitalID(dbUser.user.id);
    }
  }, [dbUser]);

  useEffect(() => {
    if (!hospitalID) return; // skip if hospitalID not set

    const fetchAlerts = async () => {
      try {
        const res = await getAlerts(hospitalID);
        setActiveAlerts([...mockPlasmaAlerts, ...res]);
      } catch (err) {
        console.error("Error loading alerts:", err);
      }
    };

    fetchAlerts();
  }, [hospitalID]);

  const handleCreateAlert = async () => {
    if (
      !newAlert.type ||
      !newAlert.bloodType ||
      !newAlert.urgency ||
      !newAlert.unitsNeeded ||
      !newAlert.description
    ) {
      return;
    }

    const alertInput = {
      id: Date.now().toString(), // temporary ID for local state
      type: newAlert.type as AlertType,
      bloodType: newAlert.bloodType as BloodType,
      urgency: newAlert.urgency.toUpperCase() as Urgency,
      unitsNeeded: newAlert.unitsNeeded,
      radius: newAlert.radius! as Radius,
      description: newAlert.description,
      hospitalId: hospitalID,
      createdAt: new Date().toLocaleString(),
      responses: 0,
      confirmed: 0,
    };

    try {
      //await createAlert(alertInput);
      console.log("Alert created on server:", alertInput);
    } catch (err) {
      console.error("Failed to create alert on server:", err);
    } finally {
      // Always update local state so the workflow continues
      setActiveAlerts((prev) => [alertInput, ...prev]);
      setShowCreateAlert(false);
    }
  };

  const getInventoryStatus = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-800 text-white border-red-900";
      case "Low":
        return "bg-yellow-600 text-white border-yellow-700";
      case "Good":
        return "bg-green-600 text-white border-green-700";
      default:
        return "bg-gray-600 text-white border-gray-700";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-800 text-white border-red-900";
      case "High":
        return "bg-orange-600 text-white border-orange-700";
      case "Medium":
        return "bg-yellow-600 text-white border-yellow-700";
      default:
        return "bg-gray-600 text-white border-gray-700";
    }
  };

  const criticalTypes = bloodInventory.filter(
    (item) => getStatus(item.current, item.minimum) === "Critical"
  ).length;

  // Total donor responses (all entries in donorResponses)
  const totalResponses = donorResponses.length;

  // Total confirmed donors
  const totalConfirmed = donorResponses.filter(
    (donor) => donor.status === "Confirmed"
  ).length;

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen text-white">
  //       Loading...
  //     </div>
  //   );
  // }

  const [justConfirmed, setJustConfirmed] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("all");

  const filteredDonors = useMemo(() => {
    return donorResponses.filter((donor) => {
      const matchesName = donor.donorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDistance =
        distanceFilter === "all" ||
        parseFloat(donor.distance) <= parseFloat(distanceFilter);

      const matchesBloodType =
        bloodTypeFilter === "all" || donor.bloodType === bloodTypeFilter;

      return matchesName && matchesDistance && matchesBloodType;
    });
  }, [donorResponses, searchTerm, distanceFilter, bloodTypeFilter]);

  const handleConfirm = (donorID: string) => {
    // Call the API to confirm the donor's response
    // confirmDonorResponse(donorID)
    //   .then(() => {
    //     // Update local state to reflect the confirmed status
    //     setDonorResponses((prev) =>
    //       prev.map((donor) =>
    //         donor.id === donorID ? { ...donor, confirmed: true } : donor
    //       )
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error confirming donor response:", error);
    //   });
  };

  const handleUpdateInventory = () => {
    setEditingItem(bloodInventory[0]); // default first one
    setIsInvModalOpen(true);
  };

  function getStatus(
    current: number,
    minimum: number
  ): "Good" | "Low" | "Critical" {
    if (current < minimum * 0.4) return "Critical";
    if (current < minimum * 0.75) return "Low";
    return "Good";
  }

  const handleSave = () => {
    if (!editingItem) return;
    setBloodInventory((prev) =>
      prev.map((b) => (b.type === editingItem.type ? editingItem : b))
    );
    setIsInvModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-900 to-yellow-600 flex flex-col relative overflow-hidden">
      <img
        src="https://fbe.unimelb.edu.au/__data/assets/image/0006/3322347/varieties/medium.jpg"
        className="w-full h-full object-cover absolute mix-blend-overlay"
      />
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-lg relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center">
                <Link href={"/"}>
                  <Building className="w-6 h-6 text-white" />
                </Link>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Hospital Dashboard
                </h1>
                <p className="text-sm text-gray-200">{user?.hospitalName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={showCreateAlert} onOpenChange={setShowCreateAlert}>
                <DialogTrigger asChild>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Alert
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white/10 backdrop-blur-lg border border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Create Emergency Blood Alert
                    </DialogTitle>
                    <DialogDescription className="text-gray-200">
                      Send immediate notifications to eligible donors in your
                      area
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Alert Type */}
                    <div className="space-y-2">
                      <Label className="text-white">Alert Type</Label>
                      <Select
                        value={newAlert.type}
                        onValueChange={(value) =>
                          setNewAlert({ ...newAlert, type: value })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Choose type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-700">
                          <SelectItem value="Blood">Blood</SelectItem>
                          <SelectItem value="Plasma">Plasma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {newAlert.type === "Blood" && (
                        <div className="space-y-2">
                          <Label className="text-white">Blood Type</Label>
                          <Select
                            value={newAlert.bloodType}
                            onValueChange={(value) =>
                              setNewAlert({ ...newAlert, bloodType: value })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-700">
                              {[
                                "A+",
                                "A-",
                                "B+",
                                "B-",
                                "AB+",
                                "AB-",
                                "O+",
                                "O-",
                              ].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-white">Urgency</Label>
                        <Select
                          value={newAlert.urgency}
                          onValueChange={(value) =>
                            setNewAlert({ ...newAlert, urgency: value })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white border-gray-700">
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Units Needed</Label>
                        <Input
                          type="number"
                          placeholder="Number of units"
                          value={newAlert.unitsNeeded}
                          onChange={(e) =>
                            setNewAlert({
                              ...newAlert,
                              unitsNeeded: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Search Radius</Label>
                        <Select
                          value={newAlert.radius}
                          onValueChange={(value) =>
                            setNewAlert({ ...newAlert, radius: value })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white border-gray-700">
                            <SelectItem value="5">5 km</SelectItem>
                            <SelectItem value="10">10 km</SelectItem>
                            <SelectItem value="15">15 km</SelectItem>
                            <SelectItem value="20">20 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Description</Label>
                      <Textarea
                        placeholder="Describe the emergency situation"
                        value={newAlert.description}
                        onChange={(e) =>
                          setNewAlert({
                            ...newAlert,
                            description: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateAlert(false)}
                        className="flex-1 border-white/20 hover:bg-white/20 text-slate-900"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateAlert}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50"
                      >
                        Send Alert
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-800/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {criticalTypes}
                  </p>
                  <p className="text-sm text-gray-200">Critical Blood Types</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {activeAlerts.length}
                  </p>
                  <p className="text-sm text-gray-200">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {totalResponses}
                  </p>
                  <p className="text-sm text-gray-200">Donor Responses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {totalConfirmed}
                  </p>
                  <p className="text-sm text-gray-200">Confirmed Donors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border border-white/20">
            <TabsTrigger
              value="inventory"
              className="text-white data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Blood Inventory
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="text-white data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Active Alerts ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="text-white data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Donor Responses
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-white data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Blood Inventory Tab */}

          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Blood Inventory Status
              </h2>
              <Button
                variant="outline"
                className="border-white/20 bg-yellow-600  text-white hover:bg-white/20 transition-all duration-300"
                onClick={() => handleUpdateInventory()}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Update Inventory
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bloodInventory.map((item) => {
                const status = getStatus(item.current, item.minimum);
                return (
                  <Card
                    key={item.type}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{item.type}</h3>
                        <Badge className={getInventoryStatus(status)}>
                          {status}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-200">
                          <span>Current: {item.current} units</span>
                          <span>Min: {item.minimum} units</span>
                        </div>
                        <Progress
                          value={(item.current / item.minimum) * 100}
                          className="h-2 bg-white/20 [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-yellow-600 [&::-moz-progress-bar]:bg-yellow-600"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          {isInvModalOpen && editingItem && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">
                  Update Blood Inventory
                </h2>

                {/* Blood Type Selector */}
                <label className="block mb-2">Blood Type</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => {
                    const selected = bloodInventory.find(
                      (b) => b.type === e.target.value
                    )!;
                    setEditingItem(selected);
                  }}
                  className="w-full border rounded px-3 py-2 mb-4"
                >
                  {bloodInventory.map((b) => (
                    <option key={b.type} value={b.type}>
                      {b.type}
                    </option>
                  ))}
                </select>

                {/* Current Units */}
                <label className="block mb-2">Current Units</label>
                <input
                  type="number"
                  value={editingItem.current}
                  onChange={(e) => {
                    const newCurrent = Number(e.target.value);
                    setEditingItem((prev) =>
                      prev
                        ? {
                            ...prev,
                            current: newCurrent,
                            status:
                              newCurrent < prev.minimum * 0.4
                                ? "Critical"
                                : newCurrent < prev.minimum * 0.75
                                ? "Low"
                                : "Good",
                          }
                        : prev
                    );
                  }}
                  className="w-full border rounded px-3 py-2 mb-4"
                />

                {/* Show computed Status (read-only) */}
                <label className="block mb-2">Status</label>
                <div
                  className={`w-full border rounded px-3 py-2 mb-6 ${
                    getStatus(editingItem.current, editingItem.minimum) ===
                    "Critical"
                      ? "text-red-600"
                      : getStatus(editingItem.current, editingItem.minimum) ===
                        "Low"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {getStatus(editingItem.current, editingItem.minimum)}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsInvModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Active Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Active Emergency Alerts
              </h2>
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50"
                onClick={() => setShowCreateAlert(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Alert
              </Button>
            </div>

            {activeAlerts.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Active Alerts
                  </h3>
                  <p className="text-gray-200 mb-4">
                    Create an emergency alert when you need blood urgently.
                  </p>
                  <Button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50"
                    onClick={() => setShowCreateAlert(true)}
                  >
                    Create First Alert
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Urgency */}
                            <Badge className={getUrgencyColor(alert.urgency!)}>
                              {alert.urgency}
                            </Badge>

                            {/* Alert Type (defaults to Blood if not set) */}
                            <Badge
                              variant="outline"
                              className="bg-white/5 border-white/20 text-white"
                            >
                              {alert.type ? alert.type : "Blood"}
                            </Badge>

                            {/* Blood Type - only show if type is Blood */}
                            {(!alert.type || alert.type === "Blood") && (
                              <Badge
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white"
                              >
                                Blood Type: {alert.bloodType}
                              </Badge>
                            )}

                            {/* Units Needed */}
                            <Badge
                              variant="outline"
                              className="bg-white/5 border-white/20 text-white"
                            >
                              {alert.unitsNeeded} units needed
                            </Badge>
                          </div>
                          <p className="text-gray-200 mb-3">
                            {alert.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {alert.createdAt}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              {alert.responses ? alert.responses : 0} responses
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              {alert.confirmed ? alert.confirmed : 0} confirmed
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white bg-yellow-600 hover:bg-white/20 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 bg-yellow-600 text-white hover:bg-white/20 transition-all duration-300"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Alert
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-yellow-600 text-red-700  border-red-600 hover:bg-red-600/20 transition-all duration-300"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Close Alert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Donor Responses Tab */}
          <TabsContent value="responses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Donor Responses</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-yellow-600"
                  />
                </div>
                <Select
                  value={bloodTypeFilter}
                  onValueChange={setBloodTypeFilter}
                >
                  <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Blood Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="all">All</SelectItem>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={distanceFilter}
                  onValueChange={setDistanceFilter}
                >
                  <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Distance" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="5">{"<5km"}</SelectItem>
                    <SelectItem value="10">{"<10km"}</SelectItem>
                    <SelectItem value="15">{"<15km"}</SelectItem>
                    <SelectItem value="20">{"<20km"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/20">
                      <tr>
                        <th className="text-left p-4 font-medium text-white">
                          Donor
                        </th>
                        <th className="text-left p-4 font-medium text-white">
                          Blood Type
                        </th>
                        <th className="text-left p-4 font-medium text-white">
                          Distance
                        </th>
                        <th className="text-left p-4 font-medium text-white">
                          ETA
                        </th>
                        <th className="text-left p-4 font-medium text-white">
                          Status
                        </th>
                        <th className="text-left p-4 font-medium text-white">
                          Contact
                        </th>
                        <th className="text-left p-4 font-medium text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonors.map((response) => (
                        <tr
                          key={response.id}
                          className="border-b border-white/10 hover:bg-white/5 transition-all duration-300"
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-white">
                                {response.donorName}
                              </p>
                              <p className="text-sm text-gray-300">
                                Last donation: {response.lastDonation}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className="bg-white/5 border-white/20 text-white"
                            >
                              {response.bloodType}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-200">
                            {response.distance}
                          </td>
                          <td className="p-4 text-gray-200">{response.eta}</td>
                          <td className="p-4">
                            <Badge
                              className={
                                response.status === "Confirmed"
                                  ? "bg-green-600 text-white"
                                  : "bg-yellow-600 text-white"
                              }
                            >
                              {response.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {response.status === "Pending" ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleConfirm(response.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white/20 hover:bg-white/20 text-slate-800"
                                  >
                                    Contact
                                  </Button>
                                </>
                              ) : justConfirmed === response.id ? (
                                <p className="text-green-700 font-medium">
                                  Thank you for confirming, the donor has been
                                  notified.
                                </p>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-white/20 hover:bg-white/20 text-slate-800"
                                >
                                  Contact
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Analytics & Reports
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-yellow-400" />
                    Response Rate Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Donor response statistics for the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-gray-200">
                    <div className="flex justify-between">
                      <span>Total Alerts Sent</span>
                      <span className="font-semibold text-white">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Rate</span>
                      <span className="font-semibold text-white">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <span className="font-semibold text-white">
                        12 minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful Collections</span>
                      <span className="font-semibold text-white">89%</span>
                    </div>
                  </div>
                  <Progress
                    value={68}
                    className="h-2 bg-white/20 [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-yellow-600 [&::-moz-progress-bar]:bg-yellow-600"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50">
                <CardHeader>
                  <CardTitle className="text-white">
                    Blood Type Demand
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Most requested blood types this month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { type: "O+", requests: 15, percentage: 35 },
                    { type: "A+", requests: 12, percentage: 28 },
                    { type: "B+", requests: 8, percentage: 19 },
                    { type: "O-", requests: 7, percentage: 16 },
                  ].map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex justify-between text-gray-200">
                        <span>{item.type}</span>
                        <span className="text-sm text-white">
                          {item.requests} requests
                        </span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className="h-2 bg-white/20 [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-yellow-600 [&::-moz-progress-bar]:bg-yellow-600"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
