import { Helmet } from "react-helmet-async"

export default function UrlName({title}){
    return (
        <Helmet>
            <title>{`${title} - ShopNow`}</title>
        </Helmet>
    )
}