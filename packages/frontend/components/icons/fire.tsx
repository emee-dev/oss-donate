import { type SVGProps } from 'react'

interface FireProps extends SVGProps<SVGSVGElement> {
    linearFrom?: string
    linearTo?: string
}

const Fire = ({ linearFrom, linearTo, ...props }: FireProps) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 1280' {...props}>
        <path
            fill='url(#fire-a)'
            d='M309.4 1.7c3.1 10 7.2 35.5 8.6 53.2 4.4 56.9-6.4 127.1-28.3 185.1-33.2 87.8-46.2 145.2-46.1 204.5 0 27 1.4 41.5 6 62 1.3 6 4 18.4 5.9 27.5 3.3 15.4 8.5 36.1 22 87.5 19.9 75.8 22.9 121.3 10.9 164-3 10.5-10.3 28.5-11.5 28.5-1.3 0-1.1-2.4.3-3.8.6-.6.9-1.5.5-1.9-.4-.3-.8-.4-1-.2-13.1 20.9-23.3 32.3-33.7 37.8-5.6 3-7.7 3.6-15.1 3.9-8 .4-9 .2-13.2-2.2-11.2-6.6-25.2-26.5-31.2-44.5-7.9-23.5-11-45.1-11-77.1.1-31.1 3.1-53.3 10.4-77.1l3-9.4-3 3.5c-3.6 4.2-8.1 14.8-12.9 30.6-2 6.6-4.7 14.6-5.8 17.6-2.8 7.4-7.5 30.5-10.1 48.8-7.1 51-4.5 102.8 7.4 145 9 31.9 23.1 60.6 40.7 83 4 5 8.6 10.8 10.1 12.8 1.6 2 3.8 3.9 5 4.2 1.3.4 2.2 1.4 2.2 2.5s3 5.8 6.6 10.5c33.5 43.1 49.7 73.3 55.3 102.9 1.8 9.5 2.1 28.9.5 37.7-2.2 12.4-3.5 15-10.3 19.9-3.5 2.5-9.2 5.8-12.8 7.5l-6.4 3-5.5-1.6c-24.2-7.1-47.1-31.9-59.9-64.9-3.3-8.5-3.8-8.6-3.3-.3 1.7 31.1 7.9 56.4 19.9 81.8 18 37.9 47.9 70 81.2 87.3 14.3 7.4 39.1 10.6 57.2 7.3 16.9-3.1 25.3-8.2 43.7-26.4 80.7-80.2 115.5-189.9 100.7-317.5-1.4-11.8-2-14.5-3.7-16-1.7-1.5-1.8-2-.7-2.7 1.1-.7 1-1.8-.3-6.7-.9-3.2-2.8-11.6-4.2-18.6-1.4-7.1-3.1-14.1-3.8-15.5-.8-1.5-1.2-3.4-1-4.4.2-.9-2.1-10.1-5.1-20.5-9.3-32.2-25.2-74.8-43.9-117.6-8-18.4-9.3-20.7-11.3-20.7H410l2.1 5.2c13.1 32.8 20.6 54.1 23.2 66.3 1.6 6.9 4.6 34.6 6.8 62 1.5 17.9.7 51.1-1.5 63-3.6 19.6-11 37.4-20.3 49-4.1 5.1-5.6 6.2-9.8 7.3-11 2.9-20.1-.3-27.2-9.6-6.4-8.4-7.7-20-4.8-41.7.8-6.1 1.5-13.2 1.5-15.9 0-3.6.6-5.6 2-7.1 1.5-1.6 2.7-6.2 4.9-19.6 7.5-44.7 10.4-78.4 10.4-121.9 0-45.3-2.3-65.4-11-94-7.8-25.7-14.1-40.6-39.8-93-27.5-56.1-34.6-73.3-41.9-102-11.7-46.2-9.7-76.9 12.4-186.5 10.2-50.4 14-71.8 16.9-94.5 8.5-65.8 3.4-119.4-15.7-166.6-4-10-5.1-12-7.1-12.2-1.8-.3-2.2 0-1.7 1.5z'
        />
        <defs>
            <linearGradient id='fire-a' x1='50%' y1='0%' x2='50%' y2='100%'>
                <stop stopColor='currentColor' className={linearFrom} />
                <stop
                    offset={1}
                    stopColor='currentColor'
                    className={linearTo}
                />
            </linearGradient>
        </defs>
    </svg>
)
export default Fire
