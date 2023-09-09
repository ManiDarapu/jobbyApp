/* eslint-disable jsx-a11y/img-redundant-alt */
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getItem()
  }

  getItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const id = this.props
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJob = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const updatedSkills = data.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const updatedLife = {
        description: data.life_at_company.description,
        imageUrl: data.life_at_company.image_url,
      }
      const updatedSimilar = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedJob,
        skills: updatedSkills,
        lifeAtCompany: updatedLife,
        similarJobs: updatedSimilar,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderInprogressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button">Retry</button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <div>
        <Header />
        <div>
          <div>
            <img src={companyLogoUrl} alt="job details company logo" />
            <div>
              <h1>{title}</h1>
              <p>
                <AiFillStar /> {rating}{' '}
              </p>
            </div>
            <div>
              <div>
                <p>{location}</p>
                <p>{employmentType}</p>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <h1>Description</h1>
          <a href={companyWebsiteUrl}>Visit</a>
          <p>{jobDescription}</p>
          <h1>Skills</h1>
          {skills.map(each => (
            <div>
              <img src={each.imageUrl} alt="skill image" />
              <p>{each.name}</p>
            </div>
          ))}
          <h1>Life at Company</h1>
          <img src={lifeAtCompany.imageUrl} alt="lifeAtCompany Image" />
          <p>{lifeAtCompany.description}</p>
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(each => (
            <li>
              <div>
                <img src={each.companyLogoUrl} alt="similarJobUrl" />
                <div>
                  <h1>{each.title}</h1>
                  <p>{each.rating}</p>
                </div>
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
                <div>
                  <p>{each.location}</p>
                  <p>{each.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderInprogressView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }
}

export default JobItemDetails
