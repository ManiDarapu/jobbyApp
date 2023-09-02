import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import Filters from '../Filters'
import JobItemDetails from '../JobItemDetails'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    activeEmploymentId: '',
    activeSalaryId: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {activeEmploymentId, activeSalaryId} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentId}&minimum_package=${activeSalaryId}&search=`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        method: 'GET',
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button">Retry</button>
    </div>
  )

  renderInprogressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state
    return (
      <div>
        <div>
          <input type="search" placeholder="search" />
          <ul>
            {jobsList.map(each => (
              <li onClick={<JobItemDetails id={each.id} />}>
                <div>
                  <img src={each.companyLogoUrl} alt="company" />
                  <div>
                    <h1>{each.title}</h1>
                    <div>
                      <AiFillStar />
                      <p>{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <MdLocationOn />
                    <p>{each.location}</p>
                    <p>{each.employmentType}</p>
                  </div>
                  <p>{each.packagePerAnnum}</p>
                </div>
                <hr />
                <div>
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderAll = () => {
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

  changeEmploymentType = activeEmploymentId => {
    this.setState({activeEmploymentId}, this.getJobs())
  }

  changeSalaryRange = activeSalaryId => {
    this.setState({activeSalaryId}, this.getJobs())
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    return (
      <div>
        <div>
          {this.renderAll()}
          <Filters
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeEmploymentType={this.changeEmploymentType}
            changeSalaryRange={this.changeSalaryRange}
          />
        </div>
      </div>
    )
  }
}

export default Jobs
