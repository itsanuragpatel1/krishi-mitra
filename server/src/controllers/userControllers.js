import mongoose from "mongoose";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { schemeModel } from "../models/schemeModel.js";
import { guidelineModel } from "../models/guidelineModel.js";

const generateAccessToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
}

const registerUser = async (req, res) => {
    try {

        console.log(req.body);
        const { name, email, mobileNo, password } = req.body;

        if (!email && !mobileNo) {
            return res.json({ success: false, message: "Please enter email or mobile number" });
        }

        const query=[];
        if(email) query.push({email});
        if(mobileNo) query.push({mobileNo});

        const existingUser=await userModel.findOne({$or:query})
    
        if (existingUser) {
            return res.json({ success: false, message: "Email or Mobile number already registered" });
        }

        // if (!name || !password) {
        //     return res.json({ success: false, message: "Please enter all required details" });
        // }

        
        if (!password) {
            return res.json({ success: false, message: "Please enter all required details" });
        }




        const hashPassword = await bcrypt.hash(password, 10);

        const userData = {
            name,
            password: hashPassword
        };

        if (email) userData.email = email;
        if (mobileNo) userData.mobileNo = mobileNo;

        const user = await userModel.create(userData);

        if(!user){
        return res.json({ success: false, message: "User Creation Failed" });
        }

        const accessToken=generateAccessToken(user._id);
        
        const options={
            httpOnly:true,
            secure:true,
            sameSite:"none"
        }

        return res
        .cookie("accessToken",accessToken,options)
        .json({ success: true, message: "User created successfully", user });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, mobileNo, password } = req.body;

        if (!email && !mobileNo) {
            return res.json({ success: false, message: "Please enter email or mobile number" });
        }

        const existingUser = await userModel.findOne({
            $or: [
                { email: email },
                { mobileNo: mobileNo }
            ]
        });

        if (!existingUser) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const accessToken =await generateAccessToken(existingUser._id);
        
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res
            .cookie("accessToken", accessToken, options)
            .json({ success: true, message: "Login successful", user: existingUser });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const logoutUser=async(req,res)=>{
    try {
        
        const options={
            httpOnly:true,
            secure:true,
            sameSite:'none'
        }

        res.cookie('accessToken',null,options)
        .json({success:true,message:"Logout successfully"})

    } catch (error) {
        console.log("error in logout ",error.message);
        res.json({success:"false",message:error.message})
    }
}


const getUser=async(req,res)=>{
    try {
        const accessToken=req.cookies?.accessToken;

        if(!accessToken){
            return res.json({success:false,message:"unauthorised"})
        }
        console.log(req.cookies)
        console.log(accessToken)
        const decode=await jwt.verify(accessToken,process.env.JWT_SECRET)
        const userId=decode.id;

        const user=await userModel.findById(userId);

        if(!user){
            return res.json({success:false,message:"unauthorised"})
        }

        res.json({success:true,message:"user fetched",user})

    } catch (error) {
        
        res.json({success:false,message:error.message});
        console.log(error)
    }
}

const getSchemes=async(req,res)=>{
    try {
    const schemes = await schemeModel.find(); 
    res.status(200).json({success: true,data: schemes});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

const getScheme=async(req,res)=>{
    try {
    const scheme = await schemeModel.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }
    res.status(200).json({ success: true, data: scheme });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}


// const guidelineData=[
//   {
//     "title": "Understanding NPK Fertilizers",
//     "shortDesc": "Learn what N, P, and K stand for, why they are crucial for plant growth, and how to choose the right ratio for your crops.",
//     "content": "<h3>What is NPK?</h3><p>NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K) - the three primary macronutrients required by plants.</p><ul><li><strong>Nitrogen (N):</strong> Essential for leaf growth and gives plants their green color. Responsible for vegetative growth.</li><li><strong>Phosphorus (P):</strong> Crucial for root development, flowering, and seed formation.</li><li><strong>Potassium (K):</strong> Improves overall plant health, disease resistance, and fruit quality.</li></ul><h4>Choosing a Ratio:</h4><p>The numbers on a fertilizer bag (e.g., 19-19-19 or 10-26-26) represent the percentage of N, P, and K. The right ratio depends on your crop type and soil test results. For example, leafy vegetables need more nitrogen, while fruit crops require more potassium.</p>",
//     "category": "Crop Management",
//     "imageUrl": "https://m.media-amazon.com/images/I/81+cfKAS4mL._AC_SL1500_.jpg",
//     "publishDate": "2025-09-24",
//     "author": "Fertilizer Association of India"
//   },
//   {
//     "title": "How to Manage Waterlogging in Your Fields",
//     "shortDesc": "Waterlogged soil can kill your crops. Learn practical techniques to drain excess water and save your harvest.",
//     "content": "<h3>The Dangers of Waterlogging</h3><p>Waterlogging occurs when soil is saturated with water, cutting off the oxygen supply to plant roots. This can lead to root rot, nutrient deficiencies, and eventually, plant death.</p><h4>Management Techniques:</h4><ol><li><strong>Surface Drainage:</strong> Create channels or furrows to direct excess surface water away from the field.</li><li><strong>Subsurface Drainage:</strong> Install perforated pipes underground to drain excess water from the root zone.</li><li><strong>Raised Beds:</strong> Plant crops on raised beds to keep their roots above the saturated soil level.</li><li><strong>Improve Soil Structure:</strong> Add organic matter like compost to improve soil porosity and drainage.</li></ol>",
//     "category": "Crop Management",
//     "imageUrl": "https://www.agrifarming.in/wp-content/uploads/2022/02/causes-of-waterlogging-1.jpg",
//     "publishDate": "2025-09-21",
//     "author": "Dr. Rakesh Kumar, Soil Scientist"
//   },
//   {
//     "title": "Vermicomposting: A Guide to Creating 'Black Gold'",
//     "shortDesc": "Learn how to turn organic waste into nutrient-rich vermicompost using earthworms to boost soil health.",
//     "content": "<h3>What is Vermicomposting?</h3><p>Vermicomposting is the process of using earthworms to decompose organic waste, turning it into a high-quality, nutrient-rich compost. This 'black gold' is an excellent organic fertilizer.</p><h4>Key Steps:</h4><ul><li><strong>Prepare a Bed:</strong> Use a tank or a pit in a shady area. Add a layer of sand, then moist loamy soil.</li><li><strong>Introduce Worms:</strong> Add a specialized earthworm species like Eisenia fetida.</li><li><strong>Add Waste:</strong> Layer partially decomposed cattle dung, farm waste, and other organic matter.</li><li><strong>Maintain Moisture:</strong> Keep the bed moist by sprinkling water as needed, but avoid waterlogging.</li><li><strong>Harvest:</strong> The compost is typically ready in 60-90 days.</li></ul>",
//     "category": "Sustainable Agriculture",
//     "imageUrl": "https://www.thespruce.com/thmb/hI-4dwZ6b_yGkLVG-TlW3yB789U=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/vermicomposting-composting-with-worms-2539612-01-e287e074092b45e9854378f1615f0a4f.jpg",
//     "publishDate": "2025-09-16",
//     "author": "Organic Farming Association"
//   },
//   {
//     "title": "Introduction to Greenhouse Farming",
//     "shortDesc": "Discover the benefits of growing crops in a controlled greenhouse environment for higher yields and off-season production.",
//     "content": "<h3>Why Use a Greenhouse?</h3><p>A greenhouse is a structure with walls and a roof made of transparent material, used for growing plants that require regulated climatic conditions. It protects crops from adverse weather and pests.</p><h4>Advantages:</h4><ul><li><strong>Off-Season Cultivation:</strong> Grow vegetables and flowers year-round.</li><li><strong>Higher Yields:</strong> Optimized growing conditions lead to significantly higher productivity.</li><li><strong>Pest & Disease Control:</strong> The enclosed structure makes it easier to manage pests and diseases.</li><li><strong>Water Efficiency:</strong> Reduces water loss through evaporation.</li></ul>",
//     "category": "Modern Farming",
//     "imageUrl": "https://i0.wp.com/www.agrifarming.in/wp-content/uploads/2019/02/Greenhouse-vegetable-farming..jpg",
//     "publishDate": "2025-09-14",
//     "author": "National Horticulture Board"
//   },
//   {
//     "title": "Mastering Drip Irrigation for Water Conservation",
//     "shortDesc": "Learn the principles of drip irrigation to save water, reduce weed growth, and increase efficiency.",
//     "content": "<h3>Why Drip Irrigation?</h3><p>Drip irrigation is a micro-irrigation system that saves water and nutrients by allowing water to drip slowly to the roots of plants. It is the most efficient method of irrigation.</p><h4>Key Benefits:</h4><ul><li><strong>Water Savings:</strong> Reduces water usage by up to 70% compared to flood irrigation.</li><li><strong>Higher Yields:</strong> Plants receive a consistent and optimal amount of water.</li><li><strong>Weed Reduction:</strong> Water is applied only to the root zone, limiting weed growth.</li><li><strong>Fertilizer Efficiency:</strong> Fertilizers can be applied directly to the roots through the system (fertigation).</li></ul>",
//     "category": "Modern Farming",
//     "imageUrl": "https://www.netafimindia.com/siteassets/drip-irrigation-in-india-1.jpg",
//     "publishDate": "2025-09-12",
//     "author": "Dr. Anil Sharma"
//   },
//   {
//     "title": "Integrated Pest Management (IPM) for Cotton",
//     "shortDesc": "A guide to controlling pests in cotton crops using a sustainable, long-term approach.",
//     "content": "<h3>What is IPM?</h3><p>Integrated Pest Management (IPM) is an eco-friendly approach that combines biological, cultural, physical, and chemical tools to manage pests. It minimizes economic, health, and environmental risks.</p><h4>Key Strategies for Cotton:</h4><ul><li><strong>Scouting:</strong> Regularly monitor fields for pests and their natural enemies.</li><li><strong>Cultural Practices:</strong> Use resistant varieties and proper crop rotation.</li><li><strong>Biological Control:</strong> Encourage beneficial insects like ladybugs and lacewings.</li><li><strong>Chemical Control:</strong> Use pesticides only as a last resort and choose selective ones.</li></ul>",
//     "category": "Pest Management",
//     "imageUrl": "https://www.agrifarming.in/wp-content/uploads/2022/05/Pest-Management-in-Cotton-1.jpg",
//     "publishDate": "2025-09-10",
//     "author": "Central Institute for Cotton Research"
//   },
//   {
//     "title": "Effective Management of Wheat Rust Disease",
//     "shortDesc": "Identify and manage the three types of rust (yellow, brown, and black) that affect wheat crops.",
//     "content": "<h3>Identifying Wheat Rust</h3><p>Wheat rust is a fungal disease that affects wheat and other cereals. It appears as small, colored pustules on the leaves and stems.</p><h4>Control Measures:</h4><ol><li><strong>Resistant Varieties:</strong> Plant wheat varieties that are genetically resistant to rust.</li><li><strong>Fungicides:</strong> Apply recommended fungicides like Propiconazole or Tebuconazole at the first sign of infection.</li><li><strong>Cultural Practices:</strong> Avoid excessive nitrogen fertilizer and manage irrigation properly.</li></ol>",
//     "category": "Crop Management",
//     "imageUrl": "https://www.graincentral.com/wp-content/uploads/2017/10/Stripe-rust-in-wheat-2.jpg",
//     "publishDate": "2025-09-08",
//     "author": "Indian Agricultural Research Institute"
//   },
//   {
//     "title": "Benefits of Zero Budget Natural Farming (ZBNF)",
//     "shortDesc": "Discover the principles of ZBNF to reduce farming costs and improve soil health naturally.",
//     "content": "<h3>Core Principles of ZBNF</h3><p>ZBNF is a method of chemical-free agriculture based on traditional Indian practices. The four pillars are:</p><ul><li><strong>Jeevamrutha:</strong> A microbial culture that acts as a catalyst to promote soil life.</li><li><strong>Beejamrutha:</strong> A treatment for seeds, seedlings or any planting material.</li><li><strong>Acchadana (Mulching):</strong> Protecting the topsoil with cover crops and crop residue.</li><li><strong>Whapasa (Moisture):</strong> Reducing the need for irrigation by maintaining soil aeration and water vapour.</li></ul>",
//     "category": "Sustainable Agriculture",
//     "imageUrl": "https://apzbnf.in/wp-content/uploads/2018/06/DSC_0055.jpg",
//     "publishDate": "2025-09-05",
//     "author": "Agricultural Expert"
//   },
//   {
//     "title": "How to Identify and Control Aphids",
//     "shortDesc": "A practical guide to finding and managing aphids, the tiny pests that suck the life out of your plants.",
//     "content": "<h3>Identifying Aphids</h3><p>Aphids are small, pear-shaped insects that can be green, black, yellow, or pink. They are usually found in clusters on the undersides of leaves and on new plant growth. They suck sap from plants and excrete a sticky substance called 'honeydew', which can lead to sooty mold.</p><h4>Control Methods:</h4><ul><li><strong>Natural Predators:</strong> Encourage beneficial insects like ladybugs and lacewings, which feed on aphids.</li><li><strong>Water Spray:</strong> A strong jet of water can dislodge them from plants.</li><li><strong>Neem Oil:</strong> A spray made from neem oil is an effective organic pesticide against aphids.</li><li><strong>Insecticidal Soaps:</strong> These are effective and have low toxicity to beneficial insects.</li></ul>",
//     "category": "Pest Management",
//     "imageUrl": "https://cdn.agric.wa.gov.au/sites/gateway/files/styles/original/public/2020-03/aphids%20on%20canola%201%20compressed.jpg?itok=3p7jI9vG",
//     "publishDate": "2025-09-02",
//     "author": "ICAR-NBAIR"
//   },
//   {
//     "title": "The Power of Crop Rotation",
//     "shortDesc": "Improve soil health, control pests, and increase yields by implementing a smart crop rotation plan.",
//     "content": "<h3>Why Rotate Crops?</h3><p>Crop rotation is the practice of growing a series of different types of crops in the same area across a sequence of growing seasons. It reduces reliance on one set of nutrients, pest and weed pressure.</p><h4>Example Rotation:</h4><p>A simple rotation could be Maize (Kharif) -> Wheat (Rabi) -> Mungbean (Summer). This rotation includes a cereal followed by another cereal and then a legume, which helps in fixing atmospheric nitrogen.</p>",
//     "category": "Sustainable Agriculture",
//     "imageUrl": "https://www.conserve-energy-future.com/wp-content/uploads/2014/08/advantages_disadvantages_crop_rotation.jpg",
//     "publishDate": "2025-09-01",
//     "author": "Dr. Meena Verma"
//   },
//   {
//     "title": "Using Drones for Precision Agriculture",
//     "shortDesc": "Explore how drones are revolutionizing farming with applications in spraying, monitoring, and mapping.",
//     "content": "<h3>Drone Technology in Farming</h3><p>Agricultural drones are unmanned aerial vehicles used to help optimize agriculture operations, increase crop production, and monitor crop growth. They provide high-resolution imagery and data.</p><h4>Common Uses:</h4><ul><li><strong>Crop Spraying:</strong> Efficient and targeted application of pesticides and fertilizers.</li><li><strong>Health Assessment:</strong> Identifying areas of stress in the field using multispectral sensors.</li><li><strong>Field Mapping:</strong> Creating detailed maps for better planning and management.</li></ul>",
//     "category": "Modern Farming",
//     "imageUrl": "https://www.deere.com/assets/images/region-4/products/precision-ag/ag-drones/drone-spraying-field-r4a093722-large-1920x1080.jpg",
//     "publishDate": "2025-08-28",
//     "author": "Tech in Agriculture Foundation"
//   },
//   {
//     "title": "Best Practices for Rice Cultivation",
//     "shortDesc": "From seed selection to harvesting, follow these best practices to maximize your rice yield.",
//     "content": "<h3>Key Steps for High Yield</h3><ul><li><strong>Land Preparation:</strong> Ensure proper puddling and levelling of the field to conserve water.</li><li><strong>Seed Selection:</strong> Use high-quality, certified seeds of recommended varieties.</li><li><strong>Water Management:</strong> Maintain a shallow water level (2-5 cm) throughout the vegetative stage.</li><li><strong>Nutrient Management:</strong> Apply fertilizers based on soil test recommendations.</li></ul>",
//     "category": "Crop Management",
//     "imageUrl": "https://www.thestatesman.com/wp-content/uploads/2022/07/iStock-516834892.jpg",
//     "publishDate": "2025-08-25",
//     "author": "ICAR"
//   },
//   {
//     "title": "How to Prepare Organic Manure (Compost)",
//     "shortDesc": "A step-by-step guide to creating nutrient-rich compost from farm waste to enrich your soil.",
//     "content": "<h3>Composting Made Easy</h3><p>Composting is a simple way to recycle farm waste, such as crop residues and animal manure, into valuable organic fertilizer.</p><h4>Steps:</h4><ol><li><strong>Choose a Location:</strong> Select a cool, shady spot.</li><li><strong>Layer Materials:</strong> Alternate layers of green materials (like grass clippings) and brown materials (like dry leaves and straw).</li><li><strong>Add Water:</strong> Keep the pile moist, but not soaking wet.</li><li><strong>Turn the Pile:</strong> Turn the compost pile every 1-2 weeks to aerate it.</li><li><strong>Ready to Use:</strong> The compost is ready in 2-3 months when it is dark, crumbly, and has an earthy smell.</li></ol>",
//     "category": "Sustainable Agriculture",
//     "imageUrl": "https://krishijagran.com/media/23847/compost-making.jpg",
//     "publishDate": "2025-08-20",
//     "author": "Krishi Vigyan Kendra"
//   },
//   {
//     "title": "Controlling Fall Armyworm in Maize",
//     "shortDesc": "An integrated approach to identify and manage the invasive Fall Armyworm pest in maize crops.",
//     "content": "<h3>Identifying Fall Armyworm</h3><p>Look for leaf damage (pinholes, windowing) and larvae with a characteristic inverted 'Y' shape on their head. They are most active during early morning or late evening.</p><h4>Management Strategy:</h4><ul><li><strong>Scouting:</strong> Monitor the crop regularly from the seedling stage.</li><li><strong>Cultural Practices:</strong> Timely planting and intercropping with legumes can help.</li><li><strong>Biological Control:</strong> Use bio-pesticides like neem-based formulations.</li><li><strong>Chemical Control:</strong> If infestation crosses the Economic Threshold Level (ETL), spray recommended insecticides like Emamectin Benzoate.</li></ul>",
//     "category": "Pest Management",
//     "imageUrl": "https://content.peat-cloud.com/w_1200,q_80/00010008-F4C5-4A9B-B1D6-8F436BDC55A7.jpg",
//     "publishDate": "2025-08-15",
//     "author": "Dept. of Plant Protection"
//   },
//   {
//     "title": "Post-Harvest Management of Pulses",
//     "shortDesc": "Learn proper techniques for drying, storing, and processing pulses to minimize losses and get better prices.",
//     "content": "<h3>Reducing Post-Harvest Losses</h3><p>Significant losses can occur after harvesting pulses. Proper management is crucial.</p><h4>Key Steps:</h4><ul><li><strong>Threshing:</strong> Thresh the crop as soon as it is harvested and dried to avoid shattering losses.</li><li><strong>Drying:</strong> Dry the grains to a safe moisture level (around 10-12%) to prevent fungal growth.</li><li><strong>Storage:</strong> Store the grains in clean, dry, and airtight containers or bags. Use hermetic bags for better protection against pests.</li></ul>",
//     "category": "Post-Harvest",
//     "imageUrl": "https://www.agrifarming.in/wp-content/uploads/2020/12/Post-Harvest-Management-of-Pulses2.jpg",
//     "publishDate": "2025-09-25",
//     "author": "Indian Institute of Pulses Research"
//   },
//   {
//     "title": "Hydroponics: Farming Without Soil",
//     "shortDesc": "An introduction to hydroponics, a modern farming technique to grow crops in nutrient-rich water.",
//     "content": "<h3>What is Hydroponics?</h3><p>Hydroponics is a type of horticulture and a subset of hydroculture which involves growing plants, usually crops, without soil, by using mineral nutrient solutions in an aqueous solvent. This technique is ideal for areas with limited land and poor soil quality.</p><h4>Advantages:</h4><ul><li>Higher yields in a smaller space.</li><li>Significantly less water usage compared to traditional farming.</li><li>Year-round production is possible in a controlled environment.</li></ul>",
//     "category": "Modern Farming",
//     "imageUrl": "https://www.agrifarming.in/wp-content/uploads/2015/02/Hydroponics-Farming.jpg",
//     "publishDate": "2025-08-10",
//     "author": "Dr. Priya Singh"
//   },
//   {
//     "title": "Soil Solarization for Weed and Pest Control",
//     "shortDesc": "Use the power of the sun to naturally control weeds, nematodes, and soil-borne pathogens before planting.",
//     "content": "<h3>How Soil Solarization Works</h3><p>Soil solarization is a non-chemical method of controlling soil pests by trapping solar energy under a clear plastic sheet. The high temperatures kill many harmful organisms in the top layer of the soil.</p><h4>Procedure:</h4><ol><li>Prepare the soil as you would for planting and ensure it is moist.</li><li>Cover the area with a thin, transparent plastic sheet.</li><li>Seal the edges of the plastic with soil to trap the heat.</li><li>Leave the plastic in place for 4-6 weeks during the hottest part of the year.</li></ol>",
//     "category": "Pest Management",
//     "imageUrl": "https://content.peat-cloud.com/w_700,q_80/8157588b-1165-4d01-a128-44e21727c9d6.jpg",
//     "publishDate": "2025-08-05",
//     "author": "State Agricultural University"
//   }
// ]


const getGuidelines = async (req, res) => {
  try {
    const guidelines = await guidelineModel.find();
    res.status(200).json({ success: true, data: guidelines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getGuideline = async (req, res) => {
  try {
    const guideline = await guidelineModel.findById(req.params.id);
    if (!guideline) {
      return res
        .status(404)
        .json({ success: false, message: "Guideline not found" });
    }
    res.status(200).json({ success: true, data: guideline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export { registerUser,loginUser,getUser ,getSchemes,getScheme , getGuideline,getGuidelines,logoutUser};
