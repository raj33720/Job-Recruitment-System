// export default Roles;
import React ,{useContext} from "react";
import { useNavigate } from "react-router-dom";
import "../style/roles.css";
import axios from 'axios';
import { UserContext } from "../assets/UserContext"; 
function Roles() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const roles = [
    {
      name: "Design Engineer",
      image: "https://www.cv-library.co.uk/career-advice/wp-content/uploads/2018/03/How-to-become-a-design-engineer-e1651761044749.jpg",
      description: "Responsible for designing and developing innovative products using CAD software."
    },
    {
      name: "Production Engineer",
      image: "https://i0.wp.com/plopdo.com/wp-content/uploads/2019/08/production-engineers.jpg?fit=3543%2C2362&ssl=1",
      description: "Optimizes manufacturing processes for efficiency and cost-effectiveness."
    },
    {
      name: "Quality Control Engineer",
      image: "https://fatfinger.io/wp-content/uploads/2023/12/quality-control-qc-engineer-monitoring-and-check-2023-11-27-05-03-51-utc-scaled.jpg",
      description: "Ensures product quality and compliance with industry standards."
    },
    {
      name: "Maintenance Engineer",
      image: "https://www.ziprecruiter.com/svc/fotomat/public-ziprecruiter/cms/165206171MaintenancePlanner.jpg=ws1280x960",
      description: "Manages preventive and corrective maintenance for industrial equipment."
    },
    {
      name: "Research & Development Engineer",
      image: "https://technologicsglobal.com/wp-content/uploads/2025/01/Screenshot-2025-01-20-164345.png",
      description: "Drives innovation by developing new technologies and improving existing products."
    },
    {
      name: "Manufacturing Process Engineer",
      image: "https://images.ctfassets.net/l4e8sx17nqs1/3jrbEmGYjcgWCaWRSuzEko/e496922ea5c3ee2b8bd1e4df534395ac/production-environment.jpg",
      description: "Enhances production workflows to maximize efficiency and reduce waste."
    },
    {
      name: "Supply Chain Engineer",
      image: "https://www.quinnox.com/wp-content/uploads/2023/06/Logistics-Company.webp",
      description: "Optimizes logistics and supply chain operations for smooth production flow."
    },
    {
      name: "Product Testing Engineer",
      image: "https://www.nemco.co.uk/wp-content/uploads/2021/02/product-testing.jpg",
      description: "Conducts tests to ensure product safety, functionality, and durability."
    },
    {
      name: "Software Developer",
      image: "https://online.maryville.edu/wp-content/uploads/sites/97/2020/07/software-developer-coding.jpg",
      description: "Develops and maintains software applications for various industries."
    },
    {
      name: "System Administrator",
      image: "https://www.liveabout.com/thmb/AX3h-choDc1B1tmN54F2ZC4ZyLs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/it-programmer-473983321-9ba7ff4909604fec8474760ced3c304a.jpg",
      description: "Manages IT infrastructure, networks, and system security."
    },
    {
      name: "Network Engineer",
      image: "https://i.ytimg.com/vi/MUyponBM248/sddefault.jpg",
      description: "Designs and maintains computer networks for seamless connectivity."
    },
    {
      name: "Data Analyst",
      image: "https://assets.cioinsight.com/uploads/2022/06/Data-Analyst-1024x682.jpeg",
      description: "Analyzes large datasets to extract insights and support decision-making."
    },
    {
      name: "Cybersecurity Analyst",
      image: "https://tecphantom.com/wp-content/uploads/2025/03/DALL%C2%B7E-2025-03-12-15.11.29-A-futuristic-cybersecurity-analyst-working-in-a-high-tech-security-operations-center-SOC.-The-analyst-is-monitoring-multiple-screens-displaying-cybe.webp",
      description: "Protects systems and data from cyber threats and security breaches."
    },
    {
      name: "ERP Specialist",
      image: "https://miro.medium.com/v2/resize:fit:1400/1*qTL3vRBylRg_zRJxEtsSPg.jpeg",
      description: "Implements and manages enterprise resource planning (ERP) systems."
    },
    {
      name: "Technical Support Engineer",
      image: "https://www.ziprecruiter.com/svc/fotomat/public-ziprecruiter/cms/899720528ITFieldTechnician.jpg=ws1280x960",
      description: "Provides technical support and troubleshooting for IT systems."
    },
    {
      name: "Automation Engineer",
      image: "https://geniussoftware.net/wp-content/uploads/2024/10/ai-and-ml-engineers-working-6-1024x512.jpg",
      description: "Develops automated solutions to improve production and processes."
    },
    {
      name: "AI/ML Engineer",
      image: "https://c9staff.com/wp-content/uploads/2024/07/Key-Trends-in-Automation-Engineering-1024x574.png",
      description: "Designs and implements artificial intelligence and machine learning models."
    },
    {
      name: "Industrial Automation Engineer",
      image: "https://media.licdn.com/dms/image/D4E12AQHje4WhufYMPw/article-cover_image-shrink_720_1280/0/1707409669809?e=2147483647&v=beta&t=nB6tipcpBtlm6bwk0gqIpMjI47kpPBNoIhSbXgCUDqg",
      description: "Specializes in automating industrial equipment and systems."
    },
    {
      name: "IoT Engineer",
      image: "https://media.licdn.com/dms/image/v2/D4D12AQGGzajexjFI1A/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1693486214918?e=2147483647&v=beta&t=aKE1t_Cz70ptEBXqRMMBVHhGT5UAX-am1qEuhCdXS30",
      description: "Develops Internet of Things devices and ensures system integration."
    },
    {
      name: "Project Manager",
      image: "https://www.herzing.edu/sites/default/files/styles/fp_900_700/public/2020-09/project-management-skills.jpg.webp?itok=4FdmYPDY",
      description: "Oversees projects, ensures timely delivery, and manages teams effectively."
    },
    {
      name: "Technical Sales Engineer",
      image: "https://careers.hilti.group/media/xkxe4a5h/technical-sales-engineer.jpg?anchor=center&mode=crop&width=900&height=675&mode=crop&quality=75",
      description: "Combines technical knowledge with sales skills to provide advice and support."
    },
    {
      name: "Product Manager",
      image: "https://storiesonboard.com/blog/wp-content/uploads/2017/10/pm-skills.png",
      description: "Leads the development and launch of products based on customer needs."
    }
  ];
  console.log("User context in Roles:", user);

  const handleApplyClick = (role) => {
    const applicantName = user?.fullName; // fallback just in case

    navigate(`/personal-details?role=${encodeURIComponent(role.name)}`);

    axios.post('http://127.0.0.1:3001/apply', {
      applicantName,
      jobRole: role.name
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="roles-container">
      <h2>Available Roles</h2>
      <div className="roles-grid">
        {roles.map((role) => (
          <div key={role.name} className="role-card">
            <img src={role.image} alt={role.name} className="card-image" />
            <div className="card-content">
              <h3 className="card-title">{role.name}</h3>
              <p className="card-description">{role.description}</p>
              <button className="apply-btn" onClick={() => handleApplyClick(role)}>
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Roles;
