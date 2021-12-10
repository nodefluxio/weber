# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- [FRONTEND] Add new background and banner images for innovations
- [FRONTEND] Add Count field in people-density analytic
- [FRONTEND] Add solution partner cards
- [FRONTEND] Add message to tell is the face occluded or not
- [FRONTEND] Add simple custom error display (404)
- [FRONTEND] Add Custom popup for Partner's Solution
- [FRONTEND] Add Compared photo in face match with enrollment results
- [BACKEND] Add 5 new seed data for partner solution service: Road Traffic Monitoring, HRIS, Citizen Apps, Health Protocol Enforcement (Covid Solution), AML / PEP
- [BACKEND] Add new service type: `solution-partner`
- [BACKEND] Add new controller to get services with service type: `solution-partner`
- [BACKEND] Add new predefined visitor in seed that will be used for a solution partner

### Changed

- [FRONTEND] Change face occlusion & attribute example one
- [FRONTEND] Modified solution card stylings
- [FRONTEND] Change new-innovations layout and style in home page
- [FRONTEND] Modified OCR receipt stylings
- [FRONTEND] Fix examples being compressed
- [FRONTEND] Change OCR KTP samples image now using KTP with fake data
- [BACKEND] Update visitor activities endpoint for solution partner
- [BACKEND] Update visitor activities endpoint for "AML / PEP (Sijitu)" partner
- [BACKEND] Replace base64 logging in analytics/innovation
- [BACKEND] Update description innovation Face Occlusion & Attribute


### Removed

- [BACKEND] Take out the unique index in service's slug

## [0.5.0 - 06/12/2021]

### Added

- [FRONTEND] Add Car Damage Assessment Innovation
- [FRONTEND] Add Face Occlusion Attribute innovation
- [FRONTEND] Add Horizontal Card Content Component
- [FRONTEND] Add Responsive Image Component
- [FRONTEND] Add nodeflux social media, products, and company links
- [FRONTEND] Add solutions banner image
- [FRONTEND] Add Horizontal Card Component
- [FRONTEND] Add fluid container to support large screen
- [FRONTEND] Add custom error message on analytic result display
- [BACKEND] Add new seed for innovation Car Damage Assessment
- [BACKEND] Add logging system in backend use logrus
- [BACKEND] Add request handler for service Face Occlusion & Attribute innovation, including handler for request to Face Detection API

### Changed

- [FRONTEND] Make solution cards slideable/swipeable
- [FRONTEND] Update contact us direct link
- [FRONTEND] Update banner image of analytics
- [FRONTEND] Update Navbar to be sticky on all devices
- [FRONTEND] Fix Carousel still slide when dot is clicked
- [FRONTEND] Make analytic cards smaller on mobile
- [FRONTEND] Changed error message & placeholder on payment form
- [FRONTEND] Update input PinInput mode as numerical (mobile browser)
- [FRONTEND] New OCR Receipt result display (colorized JSON dan simpler text display)
- [FRONTEND] Make solution cards slideable/swipeable
- [FRONTEND] Fix title for analytics page
- [FRONTEND] CSS Display fallback on Safari browsers
- [FRONTEND] Update field title and company name in request demo form to have minimum input length to 5 char
- [FRONTEND] Fix sticky navbar in request demo form page
- [FRONTEND] Scrollable analytic result
- [FRONTEND] Renamed [innovation-page].tsx to various innovation slug name
- [FRONTEND] DropzoneOption handles various file format and file size
- [FRONTEND] Fix hero-section textx too wide on mobile devices
- [BACKEND] Rename variable URL_OCR_RECEIPT to URL_INNOVATIONS in .env file
- [BACKEND] Update HTTP requester for innovation to use URL_INNOVATIONS dinamically by combine it with slug

## [0.4.0 - 25/11/2021]

### Added

- [FRONTEND] Add OCR Receipt Innovations Page
- [FRONTEND] Add current balance to catalog browse step
- [FRONTEND] Add feature to remove local storage if face payment face analytics failed
- [FRONTEND] Add back to catalog feature if balance insufficient
- [FRONTEND] Add reset balance feature
- [FRONTEND] Add shopping balance in catalog
- [FRONTEND] Make Big Input Component responsive
- [FRONTEND] Add contact us link
- [BACKEND] Add HTTP Requester for OCR Receipt Recognition Innovation
- [BACKEND] Add API Reset Balance Account on Face Payment
- [BACKEND] Add entrypoint command for seed only

### Changed

- [FRONTEND] Change pin required checking to client side
- [FRONTEND] Change phone checking to client side
- [FRONTEND] Error handling mechanism
- [FRONTEND] Revamp landing page
- [FRONTEND] Fix Camera not full on mobile
- [FRONTEND] Fix compressed photo quality on Camera
- [FRONTEND] Fix cannot use external webcam
- [FRONTEND] Change catalog shopping items
- [FRONTEND] Update Face Match with Enrollment examples with our CEO & CTO faces
- [FRONTEND] Remove short description on Banner
- [FRONTEND] Update secondary fonts
- [FRONTEND] Update Face-payment instructions
- [FRONTEND] Update ActivationForm wording about PIN
- [FRONTEND] Fix minimum payment for pin input accept 1000000
- [BACKEND] Refactor API Get Activate Account on Face Payment
- [BACKEND] Update description on seeds data
- [BACKEND] Update env FACE_ID to use by Face Match with Enrollment matching with our CEO's face

### Removed

- [FRONTEND] Remove check-phone api handler
- [FRONTEND] Remove short description on Banner
- [BACKEND] Remove API Check Limit on Face Payment

## [0.3.0 - 17/11/2021]

### Added

- [FRONTEND] Add loading animation
- [FRONTEND] Face Payment Main Menu
- [FRONTEND] Face Payment Registration Form
- [FRONTEND] Face Payment Activation Pin Form
- [FRONTEND] Face Payment Store Catalog
- [FRONTEND] Face Payment Webcam Photo Uploader
- [FRONTEND] Face Payment Confirmation & Pay Transaction
- [FRONTEND] Add thumbnails data from cropping original image data
- [FRONTEND] Add new analytic People Density, Face Demography, & Face Mask
- [BACKEND] Thumbnails data from cropping original image data
- [BACKEND] Add new seeds for analytic People Density, Face Demography, & Face Mask

### Changed

- [FRONTEND] Refactor E-KYC User Flow
- [FRONTEND] UI Responsiveness
- [BACKEND] Move the env loader file on `init()` method
- [BACKEND] Fix database connection that always re-initialized

## [0.2.0 - 29/10/2021]

### Added

- [FRONTEND] Feedback form
- [FRONTEND] Agnostic analytic page
- [FRONTEND] Analytic result for Face Match w/ Enrollment and LPR
- [FRONTEND] Open Camera and Capture Image
- [FRONTEND] e-KYC analytic face liveness
- [BACKEND] Completeness tracker
- [BACKEND] Feedback recorder

### Changed

- [FRONTEND] Fixing Industry as dropdown input
- [FRONTEND] More proper styling on landing page
- Feedback validation (1-3 stars requires comment before submit, 0 will unable to submit)

### Removed

[FRONTEND] Try again button on analytics page

## [0.1.0 - 19/10/2021]

### Added

- [FRONTEND] Landing Page
- [FRONTEND] Form Request Demo
- [FRONTEND] Modal User Information
- [FRONTEND] OCR KTP Page
- [FRONTEND] OCR KTP User Input by Drag & Drop
- [FRONTEND] OCR KTP User Input by Sample
- [FRONTEND] OCR KTP Page Result
- [BACKEND] API Create Visitor
- [BACKEND] API Request to Cloud (OCR KTP Analytic)
- [BACKEND] API Get List Services
- [BACKEND] API Get Service by ID
- [BACKEND] API Create Service Request
- [BACKEND] Validation in Form Request Demo & OCR KTP
