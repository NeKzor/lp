use log::info;

use crate::models::database::*;
use crate::models::repository::*;

const MASTER_BRANCH: &str = "https://raw.githubusercontent.com/NeKzor/lp/master";

fn sync_repository<T>() -> Vec<T>
where
    T: RepositoryItem + serde::de::DeserializeOwned,
{
    let item = T::link();
    let url = format!("{}/{}", MASTER_BRANCH, item);

    let res =
        reqwest::blocking::get(&url.to_owned()).expect(format!("failed to fetch {}", url).as_ref());

    let text = res.text().expect("failed to read text");

    let yaml: Vec<T> =
        serde_yaml::from_str(&text).expect(format!("failed to parse yaml for {}", item).as_ref());

    info!("fetched {} entries for {}", yaml.len(), item);

    yaml
}

pub fn get_records() -> (Vec<Record>, (i32, i32, i32)) {
    let mut records = sync_repository::<Record>();
    let overrides = sync_repository::<Override>();
    let showcases = sync_repository::<Showcase>();

    overrides.into_iter().for_each(|ov| {
        if let Some(record) = records.iter_mut().find(|record| record.id == ov.id) {
            record.overrides.push(ov);
        }
    });

    showcases.into_iter().for_each(|showcase| {
        if let Some(record) = records.iter_mut().find(|record| record.id == showcase.id) {
            record.showcases.push(showcase);
        }
    });

    let mut sp_map_count = 0;
    let mut mp_map_count = 0;

    let mut perfect_sp_score = 0;
    let mut perfect_mp_score = 0;

    records.iter().for_each(|record| match record.campaign {
        Campaign::SinglePlayer => {
            sp_map_count += 1;
            perfect_sp_score += record.wr;
        }
        Campaign::Cooperative => {
            mp_map_count += 1;
            perfect_mp_score += record.wr;
        }
        _ => panic!("invalid campaign for {}", record.name),
    });

    (
        records,
        (
            perfect_sp_score,
            perfect_mp_score,
            perfect_sp_score + perfect_mp_score,
        ),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sync_records() {
        let records = sync_repository::<Record>();

        use crate::models::database::Campaign;

        assert_eq!(records.len(), 99);
        assert_eq!(
            records
                .iter()
                .filter(|record| record.campaign == Campaign::SinglePlayer)
                .count(),
            51
        );
        assert_eq!(
            records
                .iter()
                .filter(|record| record.campaign == Campaign::Cooperative)
                .count(),
            48
        );
    }

    #[test]
    fn sync_overrides() {
        let overrides = sync_repository::<Override>();

        assert!(overrides.len() > 0);
    }

    #[test]
    fn sync_showcases() {
        let showcases = sync_repository::<Showcase>();

        assert!(showcases.len() > 0);
    }
}
