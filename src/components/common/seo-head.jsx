import Helmet from "preact-helmet";

export function SeoHead({
	title = "UNPAM Agenda - Kalender Akademik Interaktif Universitas Pamulang",
	description = "Dashboard kalender akademik interaktif Universitas Pamulang Semester Ganjil 2026/2027. Temukan jadwal perkuliahan, UTS/UAS, pembayaran, registrasi, PMB, dan hari libur secara real-time.",
	canonicalUrl = "https://arxdev40.github.io/unpam-agenda/",
	ogImage = "https://arxdev40.github.io/unpam-agenda/og-image.png",
}) {
	return (
		<Helmet
			title={title}
			meta={[
				{ name: "description", content: description },
				{
					name: "keywords",
					content:
						"UNPAM, Universitas Pamulang, Kalender Akademik, Agenda UNPAM, Jadwal Kuliah UNPAM, UTS UNPAM, UAS UNPAM, PMB UNPAM, Semester Ganjil 2026 2027",
				},
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:type", content: "website" },
				{ property: "og:url", content: canonicalUrl },
				{ property: "og:image", content: ogImage },
				{ property: "og:image:width", content: "1200" },
				{ property: "og:image:height", content: "630" },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: ogImage },
			]}
			link={[{ rel: "canonical", href: canonicalUrl }]}
		/>
	);
}
