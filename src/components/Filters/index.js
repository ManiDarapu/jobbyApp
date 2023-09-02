import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

const statusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}
class Filters extends Component {
  state = {status: statusConstants.initial, profile: {}}

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({status: statusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        method: 'GET',
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const fetchedData = data.profile_details
      const updatedData = {
        name: fetchedData.name,
        profileImageUrl: fetchedData.profile_image_url,
        shortBio: fetchedData.short_bio,
      }
      this.setState({status: statusConstants.success, profile: updatedData})
    } else {
      this.setState({status: statusConstants.failure})
    }
  }

  renderInprogressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <button type="button">Retry</button>
    </div>
  )

  renderSuccessView = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return (
      <div>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfile = () => {
    const {status} = this.state
    switch (status) {
      case statusConstants.failure:
        return this.renderFailureView()
      case statusConstants.inprogress:
        return this.renderInprogressView()
      case statusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  renderEmploymentType = () => {
    const {employmentTypesList} = this.props
    return employmentTypesList.map(each => {
      const {changeEmploymentType} = this.props
      const onClickEmploymentType = () => {
        changeEmploymentType(each.id)
      }
      return (
        <li onClick={onClickEmploymentType} key={each.id}>
          {each.label}
        </li>
      )
    })
  }

  renderSalaryRange = () => {
    const {salaryRangesList} = this.props
    salaryRangesList.map(each => {
      const {changeSalaryRange} = this.props
      const onClickSalaryRange = () => {
        changeSalaryRange(each.id)
      }
      return (
        <li onClick={onClickSalaryRange} key={each.id}>
          {each.label}
        </li>
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderProfile()}
        <hr />
        <div>
          <h1>Type of Employment</h1>
          <ul>{this.renderEmploymentType()}</ul>
        </div>
        <hr />
        <div>
          <h1>Salary Range</h1>
          <ul>{this.renderSalaryRange()}</ul>
        </div>
      </div>
    )
  }
}

export default Filters
