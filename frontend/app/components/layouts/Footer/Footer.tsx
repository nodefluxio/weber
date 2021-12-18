import Image from 'next/image'
import Link from 'next/link'
import { ResponsiveImage } from './../../modules/ResponsiveImage/ResponsiveImage'

export const Footer = () => {
  return (
    <div className="pt-8 pb-4 text-white lg:pb-6 lg:pt-10 bg-primary-500">
      <div className="container mx-auto">
        <div className="flex flex-col mx-5 lg:flex-row">
          <div className="w-full lg:w-1/3 lg:mr-9">
            <ResponsiveImage
              className="h-20 w-36"
              src="/assets/images/nodeflux-logo-white.png"
              alt="nodeflux logo"
              objectFit="contain"
            />
            <p className="mb-2 font-serif text-sm">
              Jl. Kemang Timur No. 24 Jakarta Selatan, 12730 Indonesia
            </p>
            <p className="font-serif text-sm text-secondary-500 text-bold">
              (021) 22718184
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:w-full lg:justify-around">
            <div className="flex flex-col sm:w-1/2 sm:mr-8">
              <div className="flex flex-wrap items-center justify-center">
                <ResponsiveImage
                  className="w-1/4 h-20"
                  src="/assets/images/nvidia-logo.png"
                  objectFit="contain"
                  alt="nvidia logo"
                />
                <ResponsiveImage
                  className="w-1/4 h-20"
                  src="/assets/images/satu-indonesia-logo.png"
                  objectFit="contain"
                  alt="satu indonesia logo"
                />
                <ResponsiveImage
                  className="w-1/4 h-20"
                  src="/assets/images/bia-logo.png"
                  objectFit="contain"
                  alt="BIA logo"
                />
                <ResponsiveImage
                  className="w-1/4 h-20"
                  src="/assets/images/identik-logo.png"
                  objectFit="contain"
                  alt="identik logo"
                />
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveImage
                  className="w-2/5 h-20 mr-3 lg:w-1/3"
                  src="/assets/images/nist-logo.png"
                  objectFit="contain"
                  alt="NIST logo"
                />
                <div>
                  <p className="font-serif text-sm">
                    Ranked Top 30th Percentile in the Leaderboard
                  </p>
                </div>
              </div>
            </div>
            <div className="flex lg:mt-4">
              <div className="flex flex-col mr-6 sm:mr-9 lg:mr-12">
                <h4 className="text-sm lg:mb-2">Products</h4>
                <div>
                  <Link href="https://docs.nodeflux.io/">
                    <a
                      className="relative block w-full h-12 lg:w-24 lg:mb-2"
                      target="_blank">
                      <Image
                        src="/assets/images/visionaire-white.png"
                        layout="fill"
                        objectFit="contain"
                        alt="Visionaire logo"
                      />
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href="https://www.identifai.id/">
                    <a
                      className="relative block w-full h-12 lg:w-24"
                      target="_blank">
                      <Image
                        src="/assets/images/identifai-white.png"
                        layout="fill"
                        objectFit="contain"
                        alt="Identifai logo"
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="mb-4 text-sm">Company</h4>
                <Link href="https://www.nodeflux.io/about-nodeflux">
                  <a
                    className="mb-1 font-serif text-sm hover:underline lg:mb-2"
                    target="_blank">
                    About Us
                  </a>
                </Link>
                <Link href="https://www.nodeflux.io/faq">
                  <a
                    className="mb-1 font-serif text-sm hover:underline lg:mb-2"
                    target="_blank">
                    FAQ
                  </a>
                </Link>
                <Link href="https://www.nodeflux.io/nodeflux-press">
                  <a
                    className="mb-1 font-serif text-sm hover:underline lg:mb-2"
                    target="_blank">
                    Press
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* sosmed */}
        <div className="flex justify-center mt-4">
          <div className="mr-2 cursor-pointer">
            <Link href="https://bit.ly/NodefluxwhatsApp">
              <a target="_blank">
                <Image
                  src="/assets/icons/wa.png"
                  alt="nodeflux WhatsApp phone number"
                  width={27}
                  height={27}
                />
              </a>
            </Link>
          </div>
          <div className="mr-2 cursor-pointer">
            <Link href="https://instagram.com/nodeflux">
              <a target="_blank">
                <Image
                  src="/assets/icons/ig.png"
                  alt="nodeflux instagram profile"
                  width={27}
                  height={27}
                />
              </a>
            </Link>
          </div>
          <div className="mr-2 cursor-pointer">
            <Link href="https://www.linkedin.com/company/nodeflux">
              <a target="_blank">
                <Image
                  src="/assets/icons/linkedin.png"
                  alt="nodeflux linkedin profile"
                  width={27}
                  height={27}
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
