import { NavLink } from "react-router-dom"

export default function Home () {
    function handlmouseE(e) {
        e.target.classList.add('hoverd')
    }
    function handlLeav(e) {
        setTimeout(()=> {
            e.target.classList.remove('hoverd')
        },2000)
    }
    return(
        <div className="Home">
        <div className="lading">
                <div className="one">
                    <div className="botm-one">
                        <p>Start Protecting Your Medical Data with a Free Account. Click Here to Create Your Secure Profile</p>
                        <NavLink to='/signup' > Create New </NavLink>
                    </div>
                    <div className="top-one">
                        <img src="https://img.freepik.com/free-photo/creative-cloud-concept-glass-cube-cloudscape-digital-metaverse-infrastructure_90220-1366.jpg?t=st=1731710150~exp=1731713750~hmac=5cd16942e91873a84ccf07d807f08cc8182faa1ffa4594b6f7eba3920b6e18ce&w=826" alt="" />
                    </div>
                </div>
                <div className="two">
                    <div className="top">
                        {
                            [...Array(30)].map((ele , i) => {
                                if (i===0) {
                                    return <div onMouseEnter={handlmouseE} onMouseLeave={handlLeav} className="fist box">
                                        <i class="fa-regular fa-sun"></i>
                                    </div>
                                } else if (i===29) {
                                    return <div onMouseEnter={handlmouseE} onMouseLeave={handlLeav} className="last n box"><i class="fa-regular fa-star"></i></div>
                                } else if (((i + 1) % 6) === 0) {
                                    return <div onMouseEnter={handlmouseE} onMouseLeave={handlLeav} className="n box"></div>
                                } else {
                                    return   <div onMouseEnter={handlmouseE} onMouseLeave={handlLeav} className=" box"></div>
                                }
                            })
                        }
                        <p>Protect <br /> your data</p>
                    </div>
                    <div className="bottom">
                        <p> <span>Secur</span> is your all-in-one platform for securely storing and managing medical data from a single, intuitive dashboard.
                        <br />
                        With state-of-the-art technology in data management and top-tier security</p>
                    </div>
                </div>
                <div className="three">
                <div className="three-top">
                        <img src="https://img.freepik.com/free-photo/ai-generated-concept-human_23-2150688433.jpg?t=st=1731709850~exp=1731713450~hmac=a016b95e9a0bced2d120f8565d52b3326caacda8a68fb04d884aded7b24e1094&w=360" alt="photo" />
                        <q>Your Safety, Our Priority</q>
                    </div>
                </div>
            </div>

        </div>
    )
}